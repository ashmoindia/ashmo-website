import { clearSessionCookie } from './_pm/session.mjs';
import {
  json,
  publicError,
  requireMethod,
  requireSameOrigin,
} from './_pm/http.mjs';

export default async (req) => {
  try {
    requireMethod(req, ['POST']);
    requireSameOrigin(req);
    return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
  } catch (error) {
    return publicError(error);
  }
};

export const config = {
  path: '/api/pm/fold',
  method: ['POST'],
};
