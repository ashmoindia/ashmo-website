import { readEnv } from './supabase.mjs';
import { createHmac, timingSafeEqual } from 'node:crypto';

const sessionCookieName = 'ashmo_admin';

const parseBasicAuth = (req) => {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('basic ')) return null;

  try {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) return null;

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
};

const getCookie = (req, name) => {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
};

const signSession = (value, secret) =>
  createHmac('sha256', secret).update(value).digest('hex');

const safeEqual = (a, b) => {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
};

const createAdminSessionCookie = ({ username, password, maxAgeSeconds = 60 * 60 * 8 }) => {
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  const signature = signSession(`${username}.${expiresAt}`, password);
  const value = encodeURIComponent(`${username}.${expiresAt}.${signature}`);

  return `${sessionCookieName}=${value}; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
};

const clearAdminSessionCookie = () =>
  `${sessionCookieName}=; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

const hasValidSessionCookie = (req, expectedUsername, expectedPassword) => {
  const cookie = getCookie(req, sessionCookieName);
  if (!cookie) return false;

  const [username, expiresAt, signature] = cookie.split('.');
  if (!username || !expiresAt || !signature) return false;
  if (username !== expectedUsername) return false;
  if (Number(expiresAt) < Date.now()) return false;

  const expectedSignature = signSession(`${username}.${expiresAt}`, expectedPassword);
  return safeEqual(signature, expectedSignature);
};

const requireAdminAuth = (req) => {
  const expectedUsername = readEnv('ADMIN_USERNAME') || 'ashmo';
  const expectedPassword = readEnv('ADMIN_PASSWORD');

  if (!expectedPassword) {
    const error = new Error('Missing ADMIN_PASSWORD environment variable.');
    error.status = 503;
    throw error;
  }

  const basicAuth = parseBasicAuth(req);
  const headerSecret = req.headers.get('x-admin-secret') || '';

  const isAuthorized =
    (basicAuth?.username === expectedUsername && basicAuth?.password === expectedPassword) ||
    hasValidSessionCookie(req, expectedUsername, expectedPassword) ||
    headerSecret === expectedPassword;

  if (!isAuthorized) {
    const error = new Error('Unauthorized admin request.');
    error.status = 401;
    throw error;
  }
};

export { clearAdminSessionCookie, createAdminSessionCookie, requireAdminAuth };
