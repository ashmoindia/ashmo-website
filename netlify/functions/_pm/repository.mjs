import { randomUUID } from 'node:crypto';
import { getPmConfig } from './config.mjs';
import { decryptTrace, encryptTrace } from './crypto.mjs';
import { databaseFetch, storageFetch } from './supabase.mjs';

const selectMoon = 'select=id,moon_slug,display_name,mooncrumb_hash,mooncrumb_salt,owner_token_hash,created_at,expires_at,stay_label,opened_at,deleted_at,is_deleted,failed_attempt_count,last_failed_attempt_at';

const getMoonBySlug = async (slug) => {
  const rows = await databaseFetch(
    `pm_moons?moon_slug=eq.${encodeURIComponent(slug)}&${selectMoon}&limit=1`,
  );
  return rows?.[0] || null;
};

const createMoon = async (moon) => {
  const rows = await databaseFetch('pm_moons', {
    method: 'POST',
    headers: { prefer: 'return=representation' },
    body: JSON.stringify(moon),
  });
  return rows?.[0];
};

const patchMoon = async (id, updates) => {
  const rows = await databaseFetch(`pm_moons?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { prefer: 'return=representation' },
    body: JSON.stringify(updates),
  });
  return rows?.[0] || null;
};

const addEvent = async (moonId, eventType) => {
  await databaseFetch('pm_events', {
    method: 'POST',
    headers: { prefer: 'return=minimal' },
    body: JSON.stringify({ moon_id: moonId, event_type: eventType }),
  });
};

const addTrace = async ({ moonId, side, type = 'text', body, filePath = null }) => {
  const { contentEncryptionKey } = getPmConfig();
  const protectedBody = body ? encryptTrace(body, contentEncryptionKey) : {};
  const rows = await databaseFetch('pm_traces', {
    method: 'POST',
    headers: { prefer: 'return=representation' },
    body: JSON.stringify({
      moon_id: moonId,
      side,
      trace_type: type,
      body_ciphertext: protectedBody.ciphertext || null,
      body_iv: protectedBody.iv || null,
      body_tag: protectedBody.tag || null,
      protected_file_path: filePath,
    }),
  });
  return rows?.[0];
};

const signedPhotoUrl = async (path) => {
  const data = await storageFetch(`object/sign/pm-pieces/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ expiresIn: 300 }),
  });
  if (!data?.signedURL) return '';
  const { supabaseUrl } = getPmConfig();
  return `${supabaseUrl}/storage/v1${data.signedURL}`;
};

const listTraces = async (moonId) => {
  const { contentEncryptionKey } = getPmConfig();
  const rows = await databaseFetch(
    `pm_traces?moon_id=eq.${encodeURIComponent(moonId)}&is_blocked=eq.false&select=id,side,trace_type,body_ciphertext,body_iv,body_tag,protected_file_path,created_at&order=created_at.asc`,
  );
  return Promise.all((rows || []).map(async (row) => ({
    id: row.id,
    side: row.side,
    type: row.trace_type,
    body: row.body_ciphertext
      ? decryptTrace({
          ciphertext: row.body_ciphertext,
          iv: row.body_iv,
          tag: row.body_tag,
        }, contentEncryptionKey)
      : '',
    photoUrl: row.protected_file_path ? await signedPhotoUrl(row.protected_file_path) : '',
    createdAt: row.created_at,
  })));
};

const recentTraceCount = async (moonId, side, sinceIso) => {
  const rows = await databaseFetch(
    `pm_traces?moon_id=eq.${encodeURIComponent(moonId)}&side=eq.${side}&created_at=gte.${encodeURIComponent(sinceIso)}&select=id`,
    { headers: { prefer: 'count=exact' } },
  );
  return rows?.length || 0;
};

const listPhotoPaths = async (moonId) => {
  const rows = await databaseFetch(
    `pm_traces?moon_id=eq.${encodeURIComponent(moonId)}&protected_file_path=not.is.null&select=protected_file_path`,
  );
  return (rows || []).map((row) => row.protected_file_path).filter(Boolean);
};

const uploadPhoto = async ({ moonId, bytes, contentType }) => {
  const extension = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }[contentType];
  const path = `${moonId}/${randomUUID()}.${extension}`;
  await storageFetch(`object/pm-pieces/${path}`, {
    method: 'POST',
    headers: {
      'content-type': contentType,
      'x-upsert': 'false',
    },
    body: bytes,
  });
  return path;
};

const removePhoto = async (path) => {
  if (!path) return;
  await storageFetch('object/pm-pieces', {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prefixes: [path] }),
  });
};

const markRemoved = async (moonId) =>
  patchMoon(moonId, { is_deleted: true, deleted_at: new Date().toISOString() });

const expiredPhotoPaths = async () =>
  databaseFetch('rpc/pm_expired_photo_paths', { method: 'POST', body: '{}' });

const deleteExpiredRows = async () =>
  databaseFetch('rpc/pm_delete_expired_rows', { method: 'POST', body: '{}' });

export {
  addEvent,
  addTrace,
  createMoon,
  deleteExpiredRows,
  expiredPhotoPaths,
  getMoonBySlug,
  listTraces,
  listPhotoPaths,
  markRemoved,
  patchMoon,
  recentTraceCount,
  removePhoto,
  uploadPhoto,
};
