import { requireAdminAuth } from './_challenge/admin-auth.mjs';
import { readEnv, supabaseFetch } from './_challenge/supabase.mjs';

const allowedStatuses = new Set(['new', 'approved', 'rejected', 'shortlisted', 'finalist', 'winner']);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });

const sanitizeText = (value, maxLength = 1000) => {
  if (value === undefined || value === null) return null;
  const cleanValue = String(value).trim().replace(/\s+/g, ' ').slice(0, maxLength);
  return cleanValue || null;
};

const sanitizeScore = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const score = Number(value);
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    const error = new Error('Score must be a whole number between 0 and 100.');
    error.status = 400;
    throw error;
  }

  return score;
};

const notifyAdminEvent = async ({ entry, updates }) => {
  const webhookUrl = readEnv('N8N_ADMIN_EVENT_WEBHOOK_URL');
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      event: updates.status === 'winner'
        ? 'challenge.entry.winner_selected'
        : updates.status === 'finalist'
          ? 'challenge.entry.finalist_selected'
          : 'challenge.entry.updated',
      entry,
      updates,
      sent_at: new Date().toISOString(),
    }),
  });
};

export default async (req, context) => {
  try {
    requireAdminAuth(req);

    if (!['POST', 'PATCH'].includes(req.method)) {
      return json({ ok: false, error: 'Method not allowed.' }, 405);
    }

    const entryId = context.params.id;
    if (!entryId) {
      return json({ ok: false, error: 'Entry id is required.' }, 400);
    }

    const payload = await req.json();
    const updates = {};

    if (payload.status !== undefined) {
      if (!allowedStatuses.has(payload.status)) {
        return json({ ok: false, error: 'Invalid entry status.' }, 400);
      }
      updates.status = payload.status;
    }

    if (payload.score !== undefined) {
      updates.score = sanitizeScore(payload.score);
    }

    if (payload.admin_notes !== undefined || payload.adminNotes !== undefined) {
      updates.admin_notes = sanitizeText(payload.admin_notes ?? payload.adminNotes);
    }

    if (Object.keys(updates).length === 0) {
      return json({ ok: false, error: 'No valid update fields supplied.' }, 400);
    }

    const rows = await supabaseFetch(`entries?id=eq.${encodeURIComponent(entryId)}&select=*`, {
      method: 'PATCH',
      headers: {
        prefer: 'return=representation',
      },
      body: JSON.stringify(updates),
    });

    if (!rows?.[0]) {
      return json({ ok: false, error: 'Entry not found.' }, 404);
    }

    context?.waitUntil?.(notifyAdminEvent({ entry: rows[0], updates }).catch((error) => {
      console.error('Admin event notification failed:', error);
    }));

    return json({ ok: true, entry: rows[0] });
  } catch (error) {
    console.error('Admin entry update error:', error);
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown admin update error.',
      },
      error.status || 500,
    );
  }
};

export const config = {
  path: '/admin/api/entries/:id',
  method: ['POST', 'PATCH'],
};
