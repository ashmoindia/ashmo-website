import { readEnv } from './supabase.mjs';

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
    headerSecret === expectedPassword;

  if (!isAuthorized) {
    const error = new Error('Unauthorized admin request.');
    error.status = 401;
    throw error;
  }
};

export { requireAdminAuth };
