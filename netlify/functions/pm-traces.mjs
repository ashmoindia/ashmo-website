import {
  json,
  moonState,
  parseJson,
  publicError,
  requireMethod,
  requireSameOrigin,
  sessionForRequest,
} from './_pm/http.mjs';
import {
  addEvent,
  addTrace,
  getMoonBySlug,
  listTraces,
  recentTraceCount,
} from './_pm/repository.mjs';
import { inspectTrace } from './_pm/safety.mjs';
import { normalizeSlug, validateTrace } from './_pm/validation.mjs';

const stateResponse = (state) =>
  json({ ok: false, state }, state === 'missing' ? 404 : 410);

export default async (req, context) => {
  try {
    requireMethod(req, ['GET', 'POST']);
    const slug = normalizeSlug(context.params.slug);
    const session = sessionForRequest(req, slug);
    const moon = await getMoonBySlug(slug);
    const state = moonState(moon);
    if (state !== 'active' || moon.id !== session.moonId) return stateResponse(state);

    if (req.method === 'GET') {
      return json({
        ok: true,
        moon: {
          name: moon.display_name,
          stayLabel: moon.stay_label,
          side: session.side,
        },
        traces: await listTraces(moon.id),
      });
    }

    requireSameOrigin(req);
    const payload = await parseJson(req);
    const body = validateTrace(payload.body);
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

    await addTrace({ moonId: moon.id, side: session.side, body });
    await addEvent(moon.id, 'trace_left');
    return json({ ok: true }, 201);
  } catch (error) {
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/moons/:slug/traces',
  method: ['GET', 'POST'],
};
