import { createHash } from 'node:crypto';
import { isMembership, offer, workbooks } from '../../src/data/commerce.mjs';
import { checkoutId, cookie, cookieValue, digest, emailAddress, nonce, seal, unseal, validStripeSignature } from './_commerce/access.mjs';
import { accessFor, CommerceError, stripeGateway } from './_commerce/stripe.mjs';
import { samples } from './_commerce/samples.mjs';

const browserCookie = 'ashmo_test_checkout';
const libraryCookie = 'ashmo_test_library';
const week = 7 * 24 * 60 * 60;
const recoveryTime = 30 * 60;
const membershipPlaybook = [
  'Compare sales with the budget. Separate order count, average ticket, channel mix and net discounts.',
  'Investigate the biggest cost movement with stock, scheduling and invoice evidence.',
  'Agree an owner, deadline and measure for one action. Review the result during the next close.',
];
const headers = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};
const json = (data, status = 200, additional = {}) => Response.json(data, { status, headers: { ...headers, ...additional } });
const error = (status, message) => new CommerceError(status, message);
const readyMessage = 'Test checkout is awaiting Stripe sandbox configuration.';
const recoveryMessage = 'If those details match an order, we’ll email an access link.';
const acceptedWebhooks = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded']);

function configuration(request, context, env) {
  const url = new URL(request.url);
  const branchContext = context?.deploy?.context ?? env('CONTEXT');
  const name = context?.site?.name;
  const configuredOrigin = env('ASHMO_COMMERCE_TEST_ORIGIN');
  if (!['deploy-preview', 'branch-deploy', 'dev'].includes(branchContext)) return null;
  if (url.protocol !== 'https:' || (configuredOrigin ? configuredOrigin !== url.origin :
      !name || !url.hostname.endsWith(`--${name}.netlify.app`))) return null;
  const stripeKey = env('ASHMO_COMMERCE_STRIPE_TEST_KEY') || '';
  const secret = env('ASHMO_COMMERCE_TEST_SESSION_SECRET') || '';
  if (!/^(sk|rk)_test_\S{16,}$/.test(stripeKey) || secret.length < 32 || stripeKey === secret) return null;
  const resendKey = env('ASHMO_COMMERCE_TEST_RESEND_KEY');
  const sender = env('ASHMO_COMMERCE_TEST_FROM');
  const recipient = emailAddress(env('ASHMO_COMMERCE_TEST_RECIPIENT'));
  return {
    origin: url.origin,
    stripeKey,
    encryptionKey: createHash('sha256').update(secret).digest(),
    stripeWebhookSecret: env('ASHMO_COMMERCE_TEST_WEBHOOK_SECRET'),
    mail: resendKey && sender && recipient ? { resendKey, sender, recipient } : null,
  };
}

function idsFor(request, settings) {
  const data = unseal(settings, 'library', cookieValue(request, libraryCookie));
  return Array.isArray(data) ? data.filter(checkoutId).slice(0, 10) : [];
}

function grant(request, settings, id) {
  const ids = [...new Set([id, ...idsFor(request, settings)])].slice(0, 10);
  return { 'Set-Cookie': cookie(libraryCookie, seal(settings, 'library', ids, week), week) };
}

async function input(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw error(415, 'JSON is required.');
  const text = await request.text();
  if (text.length > 4000) throw error(413, 'The request is too large.');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw error(400, 'Invalid request.'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw error(400, 'Invalid request.');
  return parsed;
}

async function sendAccess(settings, fetcher, id, email, messageKey) {
  if (!settings.mail || email !== settings.mail.recipient) return false;
  const bucket = Math.floor(Date.now() / 300000);
  const token = seal(settings, 'recovery', id, recoveryTime, bucket * 300000);
  const deliveryKey = `${messageKey}-${bucket}`;
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.mail.resendKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': deliveryKey,
    },
    body: JSON.stringify({
      from: settings.mail.sender,
      to: [email],
      subject: 'Your Ashmo staging access',
      text: `Test order reference: ${id}\n\nOpen your Ashmo test library: ${settings.origin}/account/#access=${token}\n\nThis link expires in 30 minutes.`,
    }),
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw error(502, 'Test email delivery is temporarily unavailable.');
  return true;
}

async function webhook(request, settings, stripe, fetcher) {
  if (!settings.stripeWebhookSecret) throw error(503, 'The Stripe test webhook is awaiting configuration.');
  const body = await request.text();
  if (body.length > 128000) throw error(413, 'The request is too large.');
  if (!validStripeSignature(request.headers.get('stripe-signature'), body, settings.stripeWebhookSecret)) {
    throw error(400, 'Invalid Stripe signature.');
  }
  let event;
  try { event = JSON.parse(body); } catch { throw error(400, 'Invalid Stripe event.'); }
  const id = event.data?.object?.id;
  if (event.livemode !== false || !acceptedWebhooks.has(event.type) || !checkoutId(id)) return json({ received: true });
  const session = await stripe.session(id);
  const access = accessFor(session, settings.origin);
  if (access?.active && session.metadata.access_email_sent !== 'true') {
    const email = emailAddress(session.customer_details?.email);
    if (await sendAccess(settings, fetcher, id, email, `ashmo-fulfil-${id}`)) await stripe.markEmailSent(id);
  }
  return json({ received: true });
}

export function makeCommerceHandler({
  env = (key) => globalThis.Netlify?.env.get(key) ?? process.env[key],
  fetcher = globalThis.fetch,
} = {}) {
  return async function handle(request, context) {
    const url = new URL(request.url);
    const action = url.pathname.split('/').filter(Boolean).at(-1);
    const settings = configuration(request, context, env);
    if (!settings) return json({ error: readyMessage }, 503);
    const stripe = stripeGateway(settings, fetcher);
    try {
      if (action === 'webhook') {
        if (request.method !== 'POST') throw error(405, 'POST is required.');
        return await webhook(request, settings, stripe, fetcher);
      }
      const readOnly = ['account', 'download', 'playbook'].includes(action);
      if (request.method !== (readOnly ? 'GET' : 'POST')) throw error(405, 'Method not allowed.');
      if (!readOnly && request.headers.get('origin') !== settings.origin) throw error(403, 'Request origin is invalid.');
      if (readOnly && request.headers.get('sec-fetch-site') === 'cross-site') throw error(403, 'Request origin is invalid.');

      if (action === 'checkout') {
        const body = await input(request);
        const item = offer(body.offer);
        const email = emailAddress(body.email);
        if (!item || !email || !/^[a-f0-9-]{36}$/.test(body.attempt || '')) throw error(400, 'Choose an offer and enter a valid email.');
        const browser = unseal(settings, 'browser', cookieValue(request, browserCookie)) || nonce();
        const redirect = await stripe.checkout(item, email, browser, body.attempt);
        return json({ redirect }, 200, { 'Set-Cookie': cookie(browserCookie, seal(settings, 'browser', browser, week), week) });
      }
      if (action === 'claim') {
        const body = await input(request);
        const recoveredId = unseal(settings, 'recovery', body.access);
        const browser = unseal(settings, 'browser', cookieValue(request, browserCookie));
        const id = recoveredId || (browser && body.reference);
        if (!checkoutId(id)) throw error(403, 'Use a valid order access link.');
        const session = await stripe.session(id);
        if (!session || (!recoveredId && session.metadata?.browser !== digest(browser))) throw error(403, 'Use a valid order access link.');
        const access = accessFor(session, settings.origin);
        if (!access?.active) throw error(409, 'Payment or membership access could not be confirmed.');
        return json({ ok: true, reference: id }, 200, grant(request, settings, id));
      }
      if (action === 'recover') {
        const body = await input(request);
        const email = emailAddress(body.email);
        if (settings.mail && email === settings.mail.recipient && checkoutId(body.reference)) {
          const session = await stripe.session(body.reference);
          if (accessFor(session, settings.origin)?.active && emailAddress(session.customer_details?.email) === email) {
            await sendAccess(settings, fetcher, body.reference, email, `ashmo-recover-${body.reference}`);
          }
        }
        return json({ message: recoveryMessage });
      }
      if (action === 'signout') {
        const response = json({ ok: true }, 200, { 'Set-Cookie': cookie(libraryCookie, '', 0) });
        response.headers.append('Set-Cookie', cookie(browserCookie, '', 0));
        return response;
      }

      const ids = idsFor(request, settings);
      const sessions = await Promise.all(ids.map(id => stripe.session(id)));
      const records = sessions.flatMap((session, index) => {
        const access = accessFor(session, settings.origin);
        return access ? [{ ...access, reference: ids[index] }] : [];
      });
      const memberships = records.filter(row => isMembership(row.item));
      const purchases = records.filter(row => !isMembership(row.item) && row.active);
      const member = memberships.some(row => row.active);
      const available = new Set(purchases.map(row => row.item.id));
      if (member) for (const item of workbooks) available.add(item.id);

      if (action === 'account') {
        return json({
          items: workbooks.filter(item => available.has(item.id)).map(item => ({
            id: item.id,
            name: item.name,
            purchased: purchases.some(row => row.item.id === item.id),
          })),
          orders: purchases.map(row => ({ name: row.item.name, reference: row.reference })),
          memberships: memberships.map(row => ({
            label: row.item.label, active: row.active, renews: row.renews,
            canManage: row.hasPortal, reference: row.reference,
          })),
          member,
          recoveryConfigured: Boolean(settings.mail),
          signedIn: ids.length > 0,
        });
      }
      if (action === 'download') {
        const id = url.searchParams.get('item');
        if (!available.has(id)) throw error(403, 'This workbook requires a purchase or active membership.');
        return new Response(Buffer.from(samples[id], 'base64'), { headers: {
          ...headers,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="ashmo-${id}-staging-sample.xlsx"`,
        } });
      }
      if (action === 'playbook') {
        if (!member) throw error(403, 'This playbook requires active membership.');
        return json({ steps: membershipPlaybook });
      }
      if (action === 'portal') {
        const body = await input(request);
        const membership = memberships.find(row => row.reference === body.reference && row.hasPortal);
        if (!membership) throw error(403, 'Membership access is required.');
        return json({ redirect: await stripe.portal(membership.customer) });
      }
      throw error(404, 'Page not found.');
    } catch (cause) {
      if (cause instanceof CommerceError) return json({ error: cause.message }, cause.status);
      console.error('Commerce request failed', action, cause instanceof Error ? cause.name : 'unknown');
      return json({ error: 'Test checkout is temporarily unavailable. Try again.' }, 502);
    }
  };
}

export default makeCommerceHandler();
export const config = {
  path: '/api/commerce/:action',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip'], windowSize: 60, windowLimit: 40 },
};
