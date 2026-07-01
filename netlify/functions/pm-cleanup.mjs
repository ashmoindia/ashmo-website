import { readEnv } from './_pm/config.mjs';
import { json, publicError, requireMethod } from './_pm/http.mjs';
import {
  deleteExpiredRows,
  expiredPhotoPaths,
  removePhoto,
} from './_pm/repository.mjs';

export default async (req) => {
  try {
    requireMethod(req, ['POST']);
    const expected = readEnv('PM_CLEANUP_SECRET');
    const provided = req.headers.get('x-pm-cleanup-secret') || '';
    if (!expected || provided !== expected) {
      const error = new Error('Not remembered.');
      error.status = 401;
      throw error;
    }
    const rows = await expiredPhotoPaths();
    await Promise.all((rows || []).map((row) => removePhoto(row.path)));
    const deleted = await deleteExpiredRows();
    return json({ ok: true, deleted, photos: rows?.length || 0 });
  } catch (error) {
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/cleanup',
  method: ['POST'],
};
