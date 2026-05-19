import { requireAdminAuth } from './_challenge/admin-auth.mjs';
import { supabaseFetch } from './_challenge/supabase.mjs';

const csvHeaders = [
  'entry_id',
  'challenge_title',
  'challenge_slug',
  'participant_name',
  'instagram_username',
  'email',
  'phone',
  'manychat_contact_id',
  'submission_type',
  'submission_url',
  'ai_tools_used',
  'caption',
  'status',
  'score',
  'admin_notes',
  'submitted_at',
];

const escapeCsv = (value) => {
  if (value === undefined || value === null) return '';
  const cleanValue = Array.isArray(value) ? value.join(', ') : String(value);
  return /[",\n\r]/.test(cleanValue) ? `"${cleanValue.replaceAll('"', '""')}"` : cleanValue;
};

const toCsv = (rows) => {
  const lines = [csvHeaders.join(',')];

  for (const row of rows) {
    lines.push(csvHeaders.map((header) => escapeCsv(row[header])).join(','));
  }

  return `${lines.join('\n')}\n`;
};

const normalizeEntry = (entry) => ({
  entry_id: entry.id,
  challenge_title: entry.challenges?.title || '',
  challenge_slug: entry.challenges?.slug || '',
  participant_name: entry.participants?.name || '',
  instagram_username: entry.participants?.instagram_username || '',
  email: entry.participants?.email || '',
  phone: entry.participants?.phone || '',
  manychat_contact_id: entry.manychat_contact_id || entry.participants?.manychat_contact_id || '',
  submission_type: entry.submission_type,
  submission_url: entry.submission_url,
  ai_tools_used: entry.ai_tools_used || [],
  caption: entry.caption || '',
  status: entry.status,
  score: entry.score ?? '',
  admin_notes: entry.admin_notes || '',
  submitted_at: entry.created_at,
});

export default async (req) => {
  try {
    requireAdminAuth(req);

    if (req.method !== 'GET') {
      return new Response('Method not allowed.', { status: 405 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const challengeId = url.searchParams.get('challenge_id');
    const query = [
      'select=*,participants(name,instagram_username,email,phone,manychat_contact_id),challenges(title,slug)',
      'order=created_at.desc',
    ];

    if (status) query.push(`status=eq.${encodeURIComponent(status)}`);
    if (challengeId) query.push(`challenge_id=eq.${encodeURIComponent(challengeId)}`);

    const entries = await supabaseFetch(`entries?${query.join('&')}`);
    const csv = toCsv((entries || []).map(normalizeEntry));
    const stamp = new Date().toISOString().slice(0, 10);

    return new Response(csv, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="ashmo-challenge-entries-${stamp}.csv"`,
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Admin entries export error:', error);
    return new Response(error instanceof Error ? error.message : 'Export failed.', {
      status: error.status || 500,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }
};

export const config = {
  path: '/admin/api/entries/export',
  method: ['GET'],
};
