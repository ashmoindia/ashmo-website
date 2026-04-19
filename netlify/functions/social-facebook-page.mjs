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

    const pageId = process.env.META_PAGE_ID;
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      throw new Error('Missing META_PAGE_ID or META_PAGE_ACCESS_TOKEN environment variable.');
    }

    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);

    if (!payload.text && !payload.caption) {
      throw new Error('Provide text or caption for the Facebook Page post.');
    }

    const endpoint = payload.imageUrl ? `${GRAPH_BASE}/${pageId}/photos` : `${GRAPH_BASE}/${pageId}/feed`;
    const body = new URLSearchParams();
    body.set('access_token', accessToken);

    if (payload.imageUrl) {
      requireFields(payload, ['imageUrl']);
      body.set('url', payload.imageUrl);
      body.set('caption', payload.caption || payload.text);
    } else {
      body.set('message', payload.text);
      if (payload.link) {
        body.set('link', payload.link);
      }
    }

    const data = await fetchJson(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    });

    return json({
      ok: true,
      platform: 'facebook',
      data,
    });
  } catch (error) {
    return safeError(error);
  }
};
