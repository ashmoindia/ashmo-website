import {
  json,
  parseBody,
  requireFields,
  requireSocialAuth,
  requireMethod,
  safeError,
  trimPayload,
} from './_social/utils.mjs';

export default async (req) => {
  try {
    requireMethod(req);
    requireSocialAuth(req);

    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);
    requireFields(payload, ['postId']);

    const error = new Error(
      'Instagram published posts still need to be removed manually in Instagram or Meta Business Suite. The current Instagram publishing API flow does not provide a safe delete route here.',
    );
    error.status = 501;
    throw error;
  } catch (error) {
    return safeError(error, 501);
  }
};
