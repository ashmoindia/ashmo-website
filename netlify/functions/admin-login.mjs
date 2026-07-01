import { createAdminSessionCookie } from './_challenge/admin-auth.mjs';
import { readEnv } from './_challenge/supabase.mjs';

const html = (body, status = 200, headers = {}) =>
  new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });

const parseForm = async (req) => {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    return Object.fromEntries(await req.formData());
  }

  return await req.json();
};

const safeNextPath = (value) => {
  const next = String(value || '/admin/entries/');
  return next.startsWith('/admin/') && !next.startsWith('/admin/api/') ? next : '/admin/entries/';
};

export default async (req) => {
  if (req.method !== 'POST') {
    return html('Method not allowed.', 405);
  }

  const expectedUsername = readEnv('ADMIN_USERNAME') || 'ashmo';
  const expectedPassword = readEnv('ADMIN_PASSWORD');

  if (!expectedPassword) {
    return html('Admin password is not configured.', 503);
  }

  const payload = await parseForm(req);
  const username = String(payload.username || '').trim();
  const password = String(payload.password || '');
  const next = safeNextPath(payload.next);

  if (username !== expectedUsername || password !== expectedPassword) {
    return Response.redirect(new URL(`/admin/login/?error=1&next=${encodeURIComponent(next)}`, req.url), 302);
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: new URL(next, req.url).toString(),
      'set-cookie': createAdminSessionCookie({ username: expectedUsername, password: expectedPassword }),
      'cache-control': 'no-store',
    },
  });
};

export const config = {
  path: '/admin/api/login',
  method: ['POST'],
};
