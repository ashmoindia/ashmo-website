import { getPmConfig } from './config.mjs';
import {
  cookieFromRequest,
  parseSessionToken,
} from './session.mjs';

const commonHeaders = {
  'cache-control': 'no-store, max-age=0',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
  'content-type': 'application/json; charset=utf-8',
  'x-content-type-options': 'nosniff',
  'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet',
};

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...commonHeaders, ...headers },
  });

const publicError = (error, fallback = 'The moon shifted unexpectedly.') => {
  const status = Number(error?.status) || 500;
  if (status >= 500) console.error('Paper Moon function error:', error);
  return json({ ok: false, error: status < 500 ? error.message : fallback }, status);
};

const requireMethod = (req, allowed) => {
  if (!allowed.includes(req.method)) {
    const error = new Error('Method not allowed.');
    error.status = 405;
    throw error;
  }
};

const requireSameOrigin = (req) => {
  const origin = req.headers.get('origin');
  if (!origin) return;
  const requestUrl = new URL(req.url);
  if (new URL(origin).host !== requestUrl.host) {
    const error = new Error('This trace came from somewhere else.');
    error.status = 403;
    throw error;
  }
};

const parseJson = async (req, maxBytes = 16_384) => {
  const length = Number(req.headers.get('content-length') || 0);
  if (length > maxBytes) {
    const error = new Error('This piece is too large.');
    error.status = 413;
    throw error;
  }
  try {
    return await req.json();
  } catch {
    const error = new Error('This piece could not be read.');
    error.status = 400;
    throw error;
  }
};

const sessionForRequest = (req, slug) => {
  const { sessionSecret } = getPmConfig();
  const session = parseSessionToken(cookieFromRequest(req), { secret: sessionSecret });
  if (!session || session.slug !== slug) {
    const error = new Error('The moon didn’t remember that.');
    error.status = 401;
    throw error;
  }
  return session;
};

const moonState = (moon) => {
  if (!moon) return 'missing';
  if (moon.is_deleted) return 'deleted';
  if (new Date(moon.expires_at).getTime() <= Date.now()) return 'expired';
  return 'active';
};

export {
  json,
  moonState,
  parseJson,
  publicError,
  requireMethod,
  requireSameOrigin,
  sessionForRequest,
};
