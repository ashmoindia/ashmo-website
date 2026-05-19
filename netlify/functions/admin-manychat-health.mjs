import { requireAdminAuth } from './_challenge/admin-auth.mjs';
import { manyChatFetch } from './_challenge/manychat.mjs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

export default async (req) => {
  try {
    requireAdminAuth(req);

    if (req.method !== 'GET') {
      return json({ ok: false, error: 'Method not allowed.' }, 405);
    }

    const data = await manyChatFetch('/fb/page/getInfo');

    return json({
      ok: true,
      page: data?.data || data,
      checked_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ManyChat health check error:', error);
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'ManyChat health check failed.',
      },
      error.status || 500,
    );
  }
};

export const config = {
  path: '/admin/api/manychat/health',
  method: ['GET'],
};
