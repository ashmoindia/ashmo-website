import {
  deleteExpiredRows,
  expiredPhotoPaths,
  removePhoto,
} from './_pm/repository.mjs';

export default async () => {
  const rows = await expiredPhotoPaths();
  await Promise.all((rows || []).map((row) => removePhoto(row.path)));
  const deleted = await deleteExpiredRows();

  return new Response(JSON.stringify({
    ok: true,
    deleted,
    photos: rows?.length || 0,
  }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};

export const config = {
  schedule: '15 3 * * *',
};
