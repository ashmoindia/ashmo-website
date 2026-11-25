import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const nonce = () => randomBytes(24).toString('base64url');
export const checkoutId = (value) => typeof value === 'string' && /^cs_test_[A-Za-z0-9]{12,100}$/.test(value);
export const emailAddress = (value) => {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return email.length <= 254 && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email) ? email : '';
};
export const digest = (value) => createHash('sha256').update(value).digest('hex');

export function seal(settings, purpose, data, lifetime, repeatableAt) {
  const scope = Buffer.from(`${settings.origin}:${purpose}`);
  const payload = JSON.stringify({ data, expires: (repeatableAt ?? Date.now()) + lifetime * 1000 });
  const iv = repeatableAt === undefined ? randomBytes(12) :
    createHmac('sha256', settings.encryptionKey).update('replay-safe-email:').update(scope).update(payload).digest().subarray(0, 12);
  const cipher = createCipheriv('aes-256-gcm', settings.encryptionKey, iv);
  cipher.setAAD(scope);
  const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64url');
}

export function unseal(settings, purpose, token) {
  if (typeof token !== 'string' || token.length > 3500 || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
  try {
    const bytes = Buffer.from(token, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', settings.encryptionKey, bytes.subarray(0, 12));
    decipher.setAAD(Buffer.from(`${settings.origin}:${purpose}`));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const value = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString());
    return value.expires > Date.now() ? value.data : null;
  } catch {
    return null;
  }
}

export function cookieValue(request, key) {
  const prefix = `${key}=`;
  return (request.headers.get('cookie') || '').split(';').map(value => value.trim()).find(value => value.startsWith(prefix))?.slice(prefix.length);
}

export function cookie(key, value, lifetime) {
  return `${key}=${value}; Path=/api/commerce/; HttpOnly; Secure; SameSite=Lax; Max-Age=${lifetime}`;
}

export function validStripeSignature(header, body, secret, now = Date.now()) {
  const fields = (header || '').split(',').map(part => part.trim().split('='));
  const timestamp = fields.find(([key]) => key === 't')?.[1];
  if (!timestamp || !/^\d{10,12}$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest();
  return fields.some(([key, hash]) => key === 'v1' && /^[a-f0-9]{64}$/.test(hash) &&
    timingSafeEqual(expected, Buffer.from(hash, 'hex')));
}
