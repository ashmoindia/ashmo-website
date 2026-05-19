import { readEnv, supabaseFetch } from './_challenge/supabase.mjs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });

const normalizeKey = (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

const sanitizeText = (value, maxLength = 500) => {
  if (value === undefined || value === null) return '';
  return String(value).trim().replace(/\s+/g, ' ').slice(0, maxLength);
};

const sanitizeInstagramUsername = (value) =>
  sanitizeText(value, 80).replace(/^@+/, '').replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();

const sanitizeEmail = (value) => sanitizeText(value, 180).toLowerCase();

const isInstagramSubmissionUrl = (value) => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === 'https:' &&
      (hostname === 'instagram.com' || hostname === 'www.instagram.com') &&
      (url.pathname.startsWith('/p/') || url.pathname.startsWith('/reel/'))
    );
  } catch {
    return false;
  }
};

const collectPayloadValues = (payload) => {
  const values = new Map();

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    if ('name' in node && 'value' in node) {
      values.set(normalizeKey(String(node.name)), node.value);
    }

    if ('field_name' in node && 'field_value' in node) {
      values.set(normalizeKey(String(node.field_name)), node.field_value);
    }

    for (const [key, value] of Object.entries(node)) {
      if (value === null || value === undefined) continue;
      if (typeof value === 'object') {
        visit(value);
      } else {
        values.set(normalizeKey(key), value);
      }
    }
  };

  visit(payload);
  return values;
};

const pick = (values, keys, maxLength = 500) => {
  for (const key of keys) {
    const value = values.get(normalizeKey(key));
    const cleanValue = sanitizeText(value, maxLength);
    if (cleanValue) return cleanValue;
  }

  return '';
};

const normalizePayload = (payload) => {
  const values = collectPayloadValues(payload);
  const submissionUrl = pick(values, [
    'submission_url',
    'submission url',
    'post_url',
    'post url',
    'reel_url',
    'reel url',
    'instagram_post_url',
    'instagram_reel_url',
    'entry_url',
  ], 600);
  const instagramUsername = sanitizeInstagramUsername(
    pick(values, ['instagram_username', 'instagram username', 'ig_username', 'username'], 120),
  );

  return {
    participantName: pick(values, ['participant_name', 'name', 'full_name', 'first_name'], 160),
    instagramUsername,
    instagramUserId: pick(values, ['instagram_user_id', 'ig_user_id', 'user_id'], 120),
    email: sanitizeEmail(pick(values, ['email', 'email_address'], 180)),
    phone: pick(values, ['phone', 'phone_number', 'mobile'], 80),
    challengeSlug: pick(values, ['challenge_slug', 'challenge slug', 'slug'], 120),
    challengeId: pick(values, ['challenge_id', 'challenge id'], 120),
    keyword: pick(values, ['keyword', 'instagram_keyword', 'trigger_keyword'], 80).toUpperCase(),
    manychatContactId: pick(values, ['manychat_contact_id', 'contact_id', 'subscriber_id'], 120),
    submissionUrl,
    aiToolsUsed: pick(values, ['ai_tools_used', 'ai tools used', 'tools', 'ai_tools'], 300),
    caption: pick(values, ['caption', 'description', 'notes'], 800),
    raw: payload,
  };
};

const detectSubmissionType = (url) => {
  try {
    return new URL(url).pathname.startsWith('/reel/') ? 'reel' : 'post';
  } catch {
    return 'post';
  }
};

const requireWebhookSecret = (req) => {
  const expectedSecret = readEnv('MANYCHAT_WEBHOOK_SECRET');

  if (!expectedSecret) {
    const error = new Error('Missing MANYCHAT_WEBHOOK_SECRET environment variable.');
    error.status = 503;
    throw error;
  }

  const authHeader = req.headers.get('authorization') || '';
  const providedSecret =
    (authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '') ||
    req.headers.get('x-manychat-webhook-secret') ||
    req.headers.get('x-webhook-secret') ||
    new URL(req.url).searchParams.get('secret') ||
    '';

  if (providedSecret !== expectedSecret) {
    const error = new Error('Unauthorized webhook request.');
    error.status = 401;
    throw error;
  }
};

const findChallenge = async ({ challengeId, challengeSlug, keyword }) => {
  const select = 'select=id,slug,title,status,instagram_keyword';

  if (challengeId) {
    const rows = await supabaseFetch(`challenges?id=eq.${encodeURIComponent(challengeId)}&${select}&limit=1`);
    if (rows?.[0]) return rows[0];
  }

  if (challengeSlug) {
    const rows = await supabaseFetch(`challenges?slug=eq.${encodeURIComponent(challengeSlug)}&${select}&limit=1`);
    if (rows?.[0]) return rows[0];
  }

  if (keyword) {
    const rows = await supabaseFetch(`challenges?instagram_keyword=eq.${encodeURIComponent(keyword)}&${select}&limit=1`);
    if (rows?.[0]) return rows[0];
  }

  return null;
};

const upsertParticipant = async (submission) => {
  const rows = await supabaseFetch('participants?on_conflict=instagram_username', {
    method: 'POST',
    headers: {
      prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      name: submission.participantName || submission.instagramUsername,
      instagram_username: submission.instagramUsername,
      instagram_user_id: submission.instagramUserId || null,
      email: submission.email || null,
      phone: submission.phone || null,
      manychat_contact_id: submission.manychatContactId || null,
      last_seen_at: new Date().toISOString(),
    }),
  });

  return rows?.[0];
};

const upsertEntry = async ({ challenge, participant, submission }) => {
  const rows = await supabaseFetch('entries?on_conflict=challenge_id,participant_id', {
    method: 'POST',
    headers: {
      prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      challenge_id: challenge.id,
      participant_id: participant.id,
      manychat_contact_id: submission.manychatContactId || null,
      submission_type: detectSubmissionType(submission.submissionUrl),
      submission_url: submission.submissionUrl,
      ai_tools_used: submission.aiToolsUsed ? submission.aiToolsUsed.split(',').map((tool) => tool.trim()).filter(Boolean) : [],
      caption: submission.caption || null,
      status: 'new',
      raw_payload: submission.raw,
    }),
  });

  return rows?.[0];
};

const notifyN8n = async ({ challenge, participant, entry }) => {
  const webhookUrl = readEnv('N8N_SUBMISSION_WEBHOOK_URL');
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      event: 'challenge.entry.created',
      challenge,
      participant,
      entry,
      sent_at: new Date().toISOString(),
    }),
  });
};

export default async (req, context) => {
  try {
    requireWebhookSecret(req);

    const payload = await req.json();
    const submission = normalizePayload(payload);

    if (!submission.submissionUrl || !isInstagramSubmissionUrl(submission.submissionUrl)) {
      return json({ ok: false, error: 'A valid public Instagram post or reel URL is required.' }, 400);
    }

    if (!submission.instagramUsername) {
      return json({ ok: false, error: 'Instagram username is required.' }, 400);
    }

    const challenge = await findChallenge(submission);
    if (!challenge) {
      return json({ ok: false, error: 'Challenge not found for supplied id, slug, or keyword.' }, 404);
    }

    const participant = await upsertParticipant(submission);
    const entry = await upsertEntry({ challenge, participant, submission });

    context?.waitUntil?.(notifyN8n({ challenge, participant, entry }).catch((error) => {
      console.error('n8n notification failed:', error);
    }));

    return json({
      ok: true,
      challenge: {
        id: challenge.id,
        slug: challenge.slug,
        title: challenge.title,
      },
      participant_id: participant.id,
      entry_id: entry.id,
      status: entry.status,
    });
  } catch (error) {
    console.error('ManyChat webhook error:', error);
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown webhook error.',
      },
      error.status || 500,
    );
  }
};

export const config = {
  method: ['POST'],
};
