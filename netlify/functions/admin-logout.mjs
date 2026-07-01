import { clearAdminSessionCookie } from './_challenge/admin-auth.mjs';

export default async (req) =>
  new Response(null, {
    status: 302,
    headers: {
      location: new URL('/admin/login/', req.url).toString(),
      'set-cookie': clearAdminSessionCookie(),
      'cache-control': 'no-store',
    },
  });

export const config = {
  path: '/admin/api/logout',
  method: ['GET', 'POST'],
};
