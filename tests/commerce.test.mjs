import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { makeCommerceHandler } from '../netlify/functions/commerce.mjs';

const origin = 'https://deploy-preview-42--ashmo-website.netlify.app';
const context = { deploy: { context: 'deploy-preview' }, site: { name: 'ashmo-website' } };
const testEmail = 'buyer@example.test';
const webhookSecret = 'whsec_fixture';
const validCharge = () => ({ paid: true, status: 'succeeded', refunded: false, disputed: false });

function fixture() {
  const sessions = new Map();
  const emails = [];
  let customerNumber = 0;
  const env = {
    ASHMO_COMMERCE_STRIPE_TEST_KEY: 'sk_test_local_fixture_only',
    ASHMO_COMMERCE_TEST_SESSION_SECRET: 'local-test-key-at-least-thirty-two-characters-long',
    ASHMO_COMMERCE_TEST_WEBHOOK_SECRET: webhookSecret,
    ASHMO_COMMERCE_TEST_RESEND_KEY: 'fixture-email-key',
    ASHMO_COMMERCE_TEST_FROM: 'test@example.test',
    ASHMO_COMMERCE_TEST_RECIPIENT: testEmail,
  };
  const customers = new Map();
  const fakeFetch = async (input, init) => {
    const url = new URL(input);
    if (url.origin === 'https://api.resend.com') {
      emails.push({ key: init.headers['Idempotency-Key'], ...JSON.parse(init.body) });
      return Response.json({ id: 'test-mail' });
    }
    assert.equal(url.origin, 'https://api.stripe.com');
    const key = url.pathname.replace('/v1/', '');
    if (key === 'customers') {
      const id = `cus_fixture_${++customerNumber}`;
      customers.set(id, init.body.get('email'));
      return Response.json({ id });
    }
    if (key === 'checkout/sessions') {
      const id = `cs_test_fixture00000${sessions.size + 1}`;
      const mode = init.body.get('mode');
      const customer = init.body.get('customer');
      const session = {
        id, mode, customer, livemode: false, status: 'complete', payment_status: 'paid',
        currency: init.body.get('line_items[0][price_data][currency]'),
        amount_total: Number(init.body.get('line_items[0][price_data][unit_amount]')),
        metadata: Object.fromEntries([...init.body].flatMap(([name, value]) => name.startsWith('metadata[') ? [[name.slice(9, -1), value]] : [])),
        customer_details: { email: customers.get(customer) },
        payment_intent: { status: 'succeeded', latest_charge: validCharge() },
        subscription: mode === 'subscription' ? {
          id: 'sub_fixture', status: 'active', current_period_end: Date.now() / 1000 + 3600,
          cancel_at_period_end: false, latest_invoice: { status: 'paid', charge: validCharge() },
        } : null,
      };
      assert.match(init.body.get('success_url'), /\/account\/\?session_id=\{CHECKOUT_SESSION_ID\}$/);
      if (mode === 'subscription') assert.match(init.body.get('line_items[0][price_data][recurring][interval]'), /^(month|year)$/);
      sessions.set(id, session);
      return Response.json({ id, livemode: false, url: `https://checkout.stripe.com/test/${id}` });
    }
    if (key === 'billing_portal/sessions') {
      assert(customers.has(init.body.get('customer')));
      return Response.json({ url: 'https://billing.stripe.com/p/session/test-fixture' });
    }
    if (key.startsWith('checkout/sessions/')) {
      const session = sessions.get(key.split('/').at(-1));
      if (!session) return new Response(null, { status: 404 });
      if (init.method === 'POST') session.metadata.access_email_sent = init.body.get('metadata[access_email_sent]');
      return Response.json(session);
    }
    throw new Error('Unrecognized provider fixture');
  };
  const handler = makeCommerceHandler({ env: key => env[key], fetcher: fakeFetch });
  const visit = (action, { method = 'GET', body, cookies = {}, requestOrigin = origin, branch = context, extraHeaders = {} } = {}) => handler(new Request(
    `${origin}/api/commerce/${action}`,
    { method, headers: { origin: requestOrigin, cookie: Object.values(cookies).join('; '),
      'content-type': 'application/json', ...extraHeaders }, body: body && (typeof body === 'string' ? body : JSON.stringify(body)) },
  ), branch);
  const remember = (res, cookies) => {
    const value = res.headers.get('set-cookie')?.split(';')[0];
    if (value) cookies[value.split('=')[0]] = value;
  };
  async function checkout(offer, cookies = {}) {
    const response = await visit('checkout', { method: 'POST', body: { offer, email: testEmail, attempt: crypto.randomUUID() }, cookies });
    assert.equal(response.status, 200);
    remember(response, cookies);
    return (await response.json()).redirect.split('/').at(-1);
  }
  async function claim(cookies, body) {
    const response = await visit('claim', { method: 'POST', body, cookies });
    remember(response, cookies);
    return response;
  }
  return { env, sessions, emails, visit, checkout, claim };
}

test('staging guard refuses production, live credentials and foreign write origins', async () => {
  const f = fixture();
  assert.equal((await f.visit('account', { branch: { ...context, deploy: { context: 'production' } } })).status, 503);
  assert.equal((await f.visit('claim', { method: 'POST', requestOrigin: 'https://elsewhere.example' })).status, 403);
  f.env.ASHMO_COMMERCE_STRIPE_TEST_KEY = 'sk_live_local_placeholder';
  assert.equal((await f.visit('account')).status, 503);
});

test('guest workbook requires an order and confirmation from the browser that started checkout', async () => {
  const f = fixture();
  const owner = {};
  const reference = await f.checkout('restaurant-pnl', owner);
  assert.equal((await f.visit('download?item=restaurant-pnl')).status, 403);
  assert.equal((await f.claim({}, { reference })).status, 403);
  const record = f.sessions.get(reference);
  record.payment_status = 'unpaid';
  assert.equal((await f.claim(owner, { reference })).status, 409);
  record.payment_status = 'paid';
  assert.equal((await f.claim(owner, { reference })).status, 200);
  const download = await f.visit('download?item=restaurant-pnl', { cookies: owner });
  assert.equal(download.status, 200);
  assert.equal(download.headers.get('cache-control'), 'private, no-store');
  assert.equal(Buffer.from(await download.arrayBuffer()).subarray(0, 2).toString(), 'PK');
  assert.equal((await f.visit('download?item=weekly-flash', { cookies: owner })).status, 403);
  record.payment_intent.latest_charge.refunded = true;
  assert.equal((await f.visit('download?item=restaurant-pnl', { cookies: owner })).status, 403);
});

test('ending membership leaves separate purchases accessible', async () => {
  const f = fixture();
  const cookies = {};
  const purchased = await f.checkout('recipe-margin', cookies);
  assert.equal((await f.claim(cookies, { reference: purchased })).status, 200);
  const member = await f.checkout('membership-annual', cookies);
  assert.equal((await f.claim(cookies, { reference: member })).status, 200);
  const account = await (await f.visit('account', { cookies })).json();
  assert.equal(account.items.length, 3);
  assert.equal(account.memberships[0].label, 'Annual');
  assert.equal((await f.visit('playbook', { cookies })).status, 200);
  assert.equal((await f.visit('portal', { method: 'POST', body: { reference: member }, cookies })).status, 200);
  f.sessions.get(member).subscription.cancel_at_period_end = true;
  const pendingEnd = await (await f.visit('account', { cookies })).json();
  assert.equal(pendingEnd.member, true);
  assert.equal(pendingEnd.memberships[0].renews, false);
  f.sessions.get(member).subscription.status = 'canceled';
  assert.equal((await f.visit('playbook', { cookies })).status, 403);
  const ended = await (await f.visit('account', { cookies })).json();
  assert.equal(ended.member, false);
  assert.deepEqual(ended.items.map(item => item.id), ['recipe-margin']);
});

test('receipt recovery returns a generic result and restores the specific purchase', async () => {
  const f = fixture();
  const reference = await f.checkout('weekly-flash');
  const wrong = await f.visit('recover', { method: 'POST', body: { reference, email: 'wrong@example.test' } });
  assert.equal(f.emails.length, 0);
  const good = await f.visit('recover', { method: 'POST', body: { reference, email: testEmail } });
  assert.deepEqual(await wrong.json(), await good.json());
  assert.equal(f.emails.length, 1);
  const token = f.emails[0].text.match(/#access=([A-Za-z0-9_-]+)/)[1];
  const recipient = {};
  assert.equal((await f.claim(recipient, { access: token })).status, 200);
  assert.equal((await f.visit('download?item=weekly-flash', { cookies: recipient })).status, 200);
  assert.equal((await f.visit('download?item=restaurant-pnl', { cookies: recipient })).status, 403);
});

test('Stripe webhook requires a valid signature and sends one access email for duplicate delivery', async () => {
  const f = fixture();
  const reference = await f.checkout('restaurant-pnl');
  const body = JSON.stringify({ livemode: false, type: 'checkout.session.completed', data: { object: { id: reference } } });
  const now = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', webhookSecret).update(`${now}.${body}`).digest('hex');
  const options = { method: 'POST', body, extraHeaders: { 'stripe-signature': `t=${now},v1=${signature}` } };
  assert.equal((await f.visit('webhook', { method: 'POST', body })).status, 400);
  assert.equal((await f.visit('webhook', options)).status, 200);
  assert.equal((await f.visit('webhook', options)).status, 200);
  assert.equal(f.emails.length, 1);
  assert.equal(f.sessions.get(reference).metadata.access_email_sent, 'true');
});
