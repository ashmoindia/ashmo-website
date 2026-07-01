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
  addTrace,
  getMoonBySlug,
  recentTraceCount,
  removePhoto,
  uploadPhoto,
} from './_pm/repository.mjs';
import { inspectTrace } from './_pm/safety.mjs';
import {
  PHOTO_MAX_BYTES,
  isAllowedImage,
  normalizeSlug,
  validateTrace,
} from './_pm/validation.mjs';

export default async (req, context) => {
  let filePath = '';
  try {
    requireMethod(req, ['POST']);
    requireSameOrigin(req);
    const slug = normalizeSlug(context.params.slug);
    const session = sessionForRequest(req, slug);
    const moon = await getMoonBySlug(slug);
    const state = moonState(moon);
    if (state !== 'active' || moon.id !== session.moonId) {
      return json({ ok: false, state }, state === 'missing' ? 404 : 410);
    }

    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > PHOTO_MAX_BYTES) {
      const error = new Error('Photo too large. Keep it under 1 MB.');
      error.status = 413;
      throw error;
    }
    const bytes = Buffer.from(await req.arrayBuffer());
    if (!bytes.length || bytes.length > PHOTO_MAX_BYTES) {
      const error = new Error('Photo too large. Keep it under 1 MB.');
      error.status = 413;
      throw error;
    }
    const contentType = isAllowedImage(bytes);
    if (!contentType) {
      const error = new Error('That photo shape is not remembered.');
      error.status = 415;
      throw error;
    }
    const captionHeader = req.headers.get('x-paper-caption') || 'A light photo.';
    const body = validateTrace(decodeURIComponent(captionHeader).slice(0, 2400));
    if (!inspectTrace(body).allowed) {
      const error = new Error('This was not added. Keep this space clean, lawful, and respectful.');
      error.status = 422;
      throw error;
    }
    const since = new Date(Date.now() - 60_000).toISOString();
    if (await recentTraceCount(moon.id, session.side, since) >= 5) {
      const error = new Error('Let the moon settle before leaving another trace.');
      error.status = 429;
      throw error;
    }

    filePath = await uploadPhoto({ moonId: moon.id, bytes, contentType });
    await addTrace({
      moonId: moon.id,
      side: session.side,
      type: 'photo',
      body,
      filePath,
    });
    await addEvent(moon.id, 'photo_left');
    return json({ ok: true }, 201);
  } catch (error) {
    if (filePath) await removePhoto(filePath).catch(() => {});
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/moons/:slug/photo',
  method: ['POST'],
};
