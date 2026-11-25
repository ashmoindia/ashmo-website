import { isMembership, offer } from '../../../src/data/commerce.mjs';
import { digest } from './access.mjs';

export const catalogMarker = 'ashmo-commerce-staging-v1';

export class CommerceError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function stripeGateway(settings, fetcher) {
  async function request(path, form, idempotencyKey) {
    const headers = {
      Authorization: `Bearer ${settings.stripeKey}`,
      'Stripe-Version': '2024-06-20',
    };
    const init = { headers, signal: AbortSignal.timeout(9000) };
    if (form) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      init.method = 'POST';
      init.body = new URLSearchParams(form);
    }
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    const response = await fetcher(`https://api.stripe.com/v1/${path}`, init);
    if (response.status === 404) return null;
    if (!response.ok) throw new CommerceError(502, 'Stripe test mode is temporarily unavailable. Try again.');
    return response.json();
  }

  return {
    async checkout(item, email, browserNonce, attempt) {
      const sessionKey = digest(`${settings.origin}:${browserNonce}:${item.id}:${email}:${attempt}`);
      const customer = await request('customers', { email }, `ashmo-customer-${sessionKey}`);
      const mode = isMembership(item) ? 'subscription' : 'payment';
      const form = {
        mode,
        customer: customer.id,
        'payment_method_types[0]': 'card',
        'line_items[0][quantity]': '1',
        'line_items[0][price_data][currency]': 'aed',
        'line_items[0][price_data][unit_amount]': String(item.amount),
        'line_items[0][price_data][product_data][name]': item.name,
        'metadata[shop]': catalogMarker,
        'metadata[offer]': item.id,
        'metadata[origin]': settings.origin,
        'metadata[browser]': digest(browserNonce),
        success_url: `${settings.origin}/account/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${settings.origin}${mode === 'subscription' ? '/membership/' : `/shop/${item.id}/`}`,
      };
      if (isMembership(item)) form['line_items[0][price_data][recurring][interval]'] = item.interval;
      const session = await request('checkout/sessions', form, `ashmo-checkout-${sessionKey}`);
      if (session?.livemode !== false || !session?.url || new URL(session.url).origin !== 'https://checkout.stripe.com') {
        throw new CommerceError(502, 'Stripe did not return a test checkout.');
      }
      return session.url;
    },
    async session(id) {
      const query = new URLSearchParams([
        ['expand[]', 'payment_intent.latest_charge'],
        ['expand[]', 'subscription.latest_invoice.charge'],
      ]);
      return request(`checkout/sessions/${encodeURIComponent(id)}?${query}`);
    },
    async portal(customer) {
      const portal = await request('billing_portal/sessions', {
        customer,
        return_url: `${settings.origin}/account/`,
      });
      if (!portal?.url || new URL(portal.url).origin !== 'https://billing.stripe.com') {
        throw new CommerceError(502, 'Stripe did not return a test billing portal.');
      }
      return portal.url;
    },
    markEmailSent(id) {
      return request(`checkout/sessions/${encodeURIComponent(id)}`, { 'metadata[access_email_sent]': 'true' });
    },
  };
}

function validCharge(charge) {
  return Boolean(charge && typeof charge === 'object' && charge.paid === true &&
    charge.status === 'succeeded' && charge.refunded === false && charge.disputed === false);
}

export function accessFor(session, origin) {
  const item = offer(session?.metadata?.offer);
  if (!item || session.livemode !== false || session.metadata.shop !== catalogMarker ||
      session.metadata.origin !== origin || session.status !== 'complete' ||
      session.payment_status !== 'paid' || session.currency !== 'aed' || session.amount_total !== item.amount) return null;

  if (isMembership(item)) {
    if (session.mode !== 'subscription') return null;
    const subscription = session.subscription;
    const invoice = subscription?.latest_invoice;
    const active = subscription?.status === 'active' && subscription.current_period_end > Date.now() / 1000 &&
      invoice?.status === 'paid' && validCharge(invoice.charge);
    return {
      item,
      active,
      customer: session.customer,
      hasPortal: typeof subscription?.id === 'string' && typeof session.customer === 'string',
      renews: active && !subscription.cancel_at_period_end,
    };
  }
  if (session.mode !== 'payment' || session.payment_intent?.status !== 'succeeded' ||
      !validCharge(session.payment_intent.latest_charge)) return null;
  return { item, active: true, hasPortal: false, renews: false };
}
