import { requireAdminAuth } from './_challenge/admin-auth.mjs';
import { supabaseFetch } from './_challenge/supabase.mjs';

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

    const rows = await supabaseFetch(
      'entries?select=*,participants(name,instagram_username,instagram_user_id,email,phone,manychat_contact_id),challenges(title,slug)&order=created_at.desc',
    );

    return json({ ok: true, entries: rows || [] });
  } catch (error) {
    console.error('Admin entries list error:', error);
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown entries list error.',
      },
      error.status || 500,
    );
  }
};

export const config = {
  path: '/admin/api/entries/list',
  method: ['GET'],
};
