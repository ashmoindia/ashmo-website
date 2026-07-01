import bcrypt from 'bcryptjs';
import { getPmConfig } from './_pm/config.mjs';
import { createOwnerCapability } from './_pm/crypto.mjs';
import {
  json,
  parseJson,
  publicError,
  requireMethod,
  requireSameOrigin,
} from './_pm/http.mjs';
import {
  addEvent,
  addTrace,
  createMoon,
  markRemoved,
} from './_pm/repository.mjs';
import { inspectTrace } from './_pm/safety.mjs';
import { createSessionToken, sessionCookie } from './_pm/session.mjs';
import {
  expiryForDuration,
  isValidSlug,
  normalizeSlug,
  stayLabelForDuration,
  validateMooncrumb,
  validateTrace,
} from './_pm/validation.mjs';

const alternativesFor = (slug) =>
  ['late', 'small', 'blue', 'glass', 'soft'].map((suffix) => `${slug}-${suffix}`.slice(0, 48));

export default async (req) => {
  let moon = null;
  let desiredSlug = 'paper-moon';
  try {
    requireMethod(req, ['POST']);
    requireSameOrigin(req);
    const payload = await parseJson(req);
    const slug = normalizeSlug(payload.name);
    desiredSlug = slug || desiredSlug;
    if (!isValidSlug(slug)) {
      const error = new Error('Choose a moon name with at least 3 letters or numbers.');
      error.status = 400;
      throw error;
    }
    const mooncrumb = validateMooncrumb(payload.mooncrumb);
    const firstTrace = validateTrace(payload.firstTrace);
    const safety = inspectTrace(firstTrace);
    if (!safety.allowed) {
      const error = new Error('This was not added. Keep this space clean, lawful, and respectful.');
      error.status = 422;
      throw error;
    }

    const mooncrumbHash = await bcrypt.hash(mooncrumb, 12);
    const ownerCapability = createOwnerCapability();
    moon = await createMoon({
      moon_slug: slug,
      display_name: slug,
      mooncrumb_hash: mooncrumbHash,
      mooncrumb_salt: bcrypt.getSalt(mooncrumbHash),
      owner_token_hash: ownerCapability.hash,
      expires_at: expiryForDuration(payload.duration).toISOString(),
      stay_label: stayLabelForDuration(payload.duration),
    });
    await addTrace({ moonId: moon.id, side: 'creator', body: firstTrace });
    await addEvent(moon.id, 'moon_created');

    const { sessionSecret } = getPmConfig();
    const token = createSessionToken({
      moonId: moon.id,
      slug,
      side: 'creator',
      secret: sessionSecret,
    });
    return json(
      {
        ok: true,
        slug,
        url: `https://ashmo.io/pm/${slug}/`,
        ownerToken: ownerCapability.token,
      },
      201,
      { 'set-cookie': sessionCookie(token) },
    );
  } catch (error) {
    if (moon?.id) await markRemoved(moon.id).catch(() => {});
    if (error?.status === 409 || error?.details?.code === '23505') {
      return json({
        ok: false,
        error: 'That moon name is already floating nearby.',
        alternatives: alternativesFor(desiredSlug),
      }, 409);
    }
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/moons',
  method: ['POST'],
};
