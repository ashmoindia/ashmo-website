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
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (req) => {
  try {
    requireMethod(req);
    requireSocialAuth(req);

    const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

    if (!igAccountId || !accessToken) {
      throw new Error('Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or META_PAGE_ACCESS_TOKEN environment variable.');
    }

    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);
    requireFields(payload, ['imageUrl']);

    const caption = payload.caption || payload.text;

    const container = await fetchJson(`${GRAPH_BASE}/${igAccountId}/media`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams({
        image_url: payload.imageUrl,
        caption,
        access_token: accessToken,
      }),
    });

    let published;
    let lastError;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      if (attempt > 0) {
        await wait(2000 * attempt);
      }

      try {
        published = await fetchJson(`${GRAPH_BASE}/${igAccountId}/media_publish`, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: new URLSearchParams({
            creation_id: container.id,
            access_token: accessToken,
          }),
        });
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!published) {
      throw lastError || new Error('Instagram media could not be published.');
    }

    return json({
      ok: true,
      platform: 'instagram',
      container,
      published,
    });
  } catch (error) {
    return safeError(error);
  }
};
