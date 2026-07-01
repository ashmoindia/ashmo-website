const sessionCookieName = 'ashmo_admin';

const redirectToLogin = (req) => {
  const url = new URL('/admin/login/', req.url);
  url.searchParams.set('next', new URL(req.url).pathname);

  return Response.redirect(url, 302);
};

const parseBasicAuth = (req) => {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('basic ')) return null;

  try {
    const decoded = atob(authHeader.slice(6));
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

const toHex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

const signSession = async (value, secret) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return toHex(signature);
};

const verifySessionCookie = async (req, expectedUsername, expectedPassword) => {
  const cookie = getCookie(req, sessionCookieName);
  if (!cookie) return false;

  const [username, expiresAt, signature] = cookie.split('.');
  if (!username || !expiresAt || !signature) return false;
  if (username !== expectedUsername) return false;
  if (Number(expiresAt) < Date.now()) return false;

  const expectedSignature = await signSession(`${username}.${expiresAt}`, expectedPassword);
  return signature === expectedSignature;
};

export default async (req, context) => {
  const pathname = new URL(req.url).pathname;
  if (
    pathname === '/admin/login/' ||
    pathname === '/admin/api/login' ||
    pathname === '/admin/api/logout'
  ) {
    return context.next();
  }

  const expectedUsername = Netlify.env.get('ADMIN_USERNAME') || 'ashmo';
  const expectedPassword = Netlify.env.get('ADMIN_PASSWORD');

  if (!expectedPassword) {
    return new Response('Admin password is not configured.', {
      status: 503,
      headers: { 'cache-control': 'no-store' },
    });
  }

  const credentials = parseBasicAuth(req);
  const hasBasicAuth = credentials?.username === expectedUsername && credentials?.password === expectedPassword;
  const hasCookieAuth = await verifySessionCookie(req, expectedUsername, expectedPassword);

  if (!hasBasicAuth && !hasCookieAuth) {
    return redirectToLogin(req);
  }

  const response = await context.next();
  response.headers.set('cache-control', 'no-store');
  return response;
};

export const config = {
  path: '/admin/*',
};
