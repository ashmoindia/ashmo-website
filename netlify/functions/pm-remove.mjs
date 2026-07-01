import {
  json,
  moonState,
  publicError,
  requireMethod,
  requireSameOrigin,
  sessionForRequest,
} from './_pm/http.mjs';
import {
  addEvent,
  getMoonBySlug,
  listPhotoPaths,
  markRemoved,
  removePhoto,
} from './_pm/repository.mjs';
import { clearSessionCookie } from './_pm/session.mjs';
import { normalizeSlug } from './_pm/validation.mjs';

export default async (req, context) => {
  try {
    requireMethod(req, ['POST']);
    requireSameOrigin(req);
    const slug = normalizeSlug(context.params.slug);
    const session = sessionForRequest(req, slug);
    if (session.side !== 'creator') {
      const error = new Error('Only the maker can remove this moon.');
      error.status = 403;
      throw error;
    }
    const moon = await getMoonBySlug(slug);
    const state = moonState(moon);
    if (state !== 'active' || moon.id !== session.moonId) {
      return json({ ok: false, state }, state === 'missing' ? 404 : 410);
    }
    const photoPaths = await listPhotoPaths(moon.id);
    await Promise.all(photoPaths.map((path) => removePhoto(path)));
    await markRemoved(moon.id);
    await addEvent(moon.id, 'moon_removed');
    return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
  } catch (error) {
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/moons/:slug/remove',
  method: ['POST'],
};
