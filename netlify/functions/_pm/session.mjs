import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'paper_moon_fold';
const SESSION_MS = 30 * 60 * 1000;

const sign = (payload, secret) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

const safeEqual = (left, right) => {
  try {
    return timingSafeEqual(Buffer.from(left), Buffer.from(right));
  } catch {
    return false;
  }
};

const createSessionToken = ({
  moonId,
  slug,
  side,
  secret,
  now = Date.now(),
}) => {
  const payload = Buffer.from(JSON.stringify({
    moonId,
    slug,
    side,
    expiresAt: now + SESSION_MS,
  })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
};

const parseSessionToken = (token, { secret, now = Date.now() }) => {
  try {
    const [payload, signature] = String(token ?? '').split('.');
    if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return null;
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      !session.moonId
      || !session.slug
      || !['creator', 'visitor'].includes(session.side)
      || !Number.isFinite(session.expiresAt)
      || session.expiresAt <= now
    ) return null;
    return session;
  } catch {
    return null;
  }
};

const cookieFromRequest = (req) => {
  const raw = req.headers.get('cookie') || '';
  const prefix = `${COOKIE_NAME}=`;
  const item = raw.split(';').map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : '';
};

const sessionCookie = (token) =>
  `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`;

const clearSessionCookie = () =>
  `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export {
  COOKIE_NAME,
  clearSessionCookie,
  cookieFromRequest,
  createSessionToken,
  parseSessionToken,
  sessionCookie,
};
