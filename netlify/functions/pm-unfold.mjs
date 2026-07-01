import bcrypt from 'bcryptjs';
import { getPmConfig } from './_pm/config.mjs';
import { verifyOwnerCapability } from './_pm/crypto.mjs';
import {
  json,
  moonState,
  parseJson,
  publicError,
  requireMethod,
  requireSameOrigin,
} from './_pm/http.mjs';
import {
  addEvent,
  getMoonBySlug,
  patchMoon,
} from './_pm/repository.mjs';
import { createSessionToken, sessionCookie } from './_pm/session.mjs';
import { normalizeSlug, validateMooncrumb } from './_pm/validation.mjs';

const fallbackHash = '$2b$12$ixvV6YjP9aB1R8D7m1vlee4OgvwZ1vKaHBvn7/4wXJxLsDSnZzvyS';
const cooldownMs = 15 * 60 * 1000;

export default async (req, context) => {
  try {
    requireMethod(req, ['POST']);
    requireSameOrigin(req);
    const slug = normalizeSlug(context.params.slug);
    const payload = await parseJson(req);
    const mooncrumb = validateMooncrumb(payload.mooncrumb);
    const moon = await getMoonBySlug(slug);

    if (
      moon
      && moon.failed_attempt_count >= 5
      && moon.last_failed_attempt_at
      && Date.now() - new Date(moon.last_failed_attempt_at).getTime() < cooldownMs
    ) {
      const error = new Error('The moon is resting for a little while.');
      error.status = 429;
      throw error;
    }

    const matches = await bcrypt.compare(mooncrumb, moon?.mooncrumb_hash || fallbackHash);
    if (!moon || !matches) {
      if (moon) {
        await patchMoon(moon.id, {
          failed_attempt_count: moon.failed_attempt_count + 1,
          last_failed_attempt_at: new Date().toISOString(),
        });
      }
      const error = new Error('The moon didn’t remember that.');
      error.status = 401;
      throw error;
    }

    const state = moonState(moon);
    if (state !== 'active') {
      return json({ ok: false, state }, 410);
    }

    await patchMoon(moon.id, {
      failed_attempt_count: 0,
      last_failed_attempt_at: null,
      opened_at: moon.opened_at || new Date().toISOString(),
    });
    await addEvent(moon.id, 'moon_unfolded');

    const side = payload.ownerToken
      && verifyOwnerCapability(payload.ownerToken, moon.owner_token_hash)
      ? 'creator'
      : 'visitor';
    const { sessionSecret } = getPmConfig();
    const token = createSessionToken({
      moonId: moon.id,
      slug,
      side,
      secret: sessionSecret,
    });
    return json(
      { ok: true, name: moon.display_name, stayLabel: moon.stay_label, side },
      200,
      { 'set-cookie': sessionCookie(token) },
    );
  } catch (error) {
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/moons/:slug/unfold',
  method: ['POST'],
};
