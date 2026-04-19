import {
  fetchJson,
  json,
  parseBody,
  requireFields,
  requireSocialAuth,
  requireMethod,
  safeError,
  trimPayload,
} from './_social/utils.mjs';

const GRAPH_BASE = 'https://graph.facebook.com/v23.0';

export default async (req) => {
  try {
    requireMethod(req);
    requireSocialAuth(req);

    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Missing META_PAGE_ACCESS_TOKEN environment variable.');
    }

    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);
    requireFields(payload, ['postId']);

    const data = await fetchJson(
      `${GRAPH_BASE}/${encodeURIComponent(payload.postId)}?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'DELETE',
      },
    );

    return json({
      ok: true,
      platform: 'facebook',
      postId: payload.postId,
      data,
    });
  } catch (error) {
    return safeError(error);
  }
};
