import {
  fetchJsonDetailed,
  json,
  parseBody,
  requireFields,
  requireSocialAuth,
  requireMethod,
  safeError,
  trimPayload,
} from './_social/utils.mjs';

const LINKEDIN_POSTS_URL = 'https://api.linkedin.com/rest/posts';
const DEFAULT_LINKEDIN_VERSION = '202502';

const linkedinHeaders = (accessToken, linkedinVersion, extra = {}) => ({
  Authorization: `Bearer ${accessToken}`,
  'LinkedIn-Version': linkedinVersion,
  'X-Restli-Protocol-Version': '2.0.0',
  ...extra,
});

export default async (req) => {
  try {
    requireMethod(req);
    requireSocialAuth(req);

    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const linkedinVersion = process.env.LINKEDIN_API_VERSION || DEFAULT_LINKEDIN_VERSION;

    if (!accessToken) {
      throw new Error('Missing LINKEDIN_ACCESS_TOKEN environment variable.');
    }

    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);
    requireFields(payload, ['postId']);

    await fetchJsonDetailed(`${LINKEDIN_POSTS_URL}/${encodeURIComponent(payload.postId)}`, {
      method: 'DELETE',
      headers: linkedinHeaders(accessToken, linkedinVersion),
    });

    return json({
      ok: true,
      platform: 'linkedin',
      postId: payload.postId,
    });
  } catch (error) {
    return safeError(error);
  }
};
