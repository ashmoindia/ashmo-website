import {
  json,
  parseBody,
  requireSocialAuth,
  requireMethod,
  safeError,
  trimPayload,
} from './_social/utils.mjs';

const buildPreview = (platform, payload) => {
  if (platform === 'facebook') {
    return {
      endpoint: payload.imageUrl
        ? 'POST https://graph.facebook.com/v23.0/{page-id}/photos'
        : 'POST https://graph.facebook.com/v23.0/{page-id}/feed',
      payload: payload.imageUrl
        ? {
            url: payload.imageUrl,
            caption: payload.caption || payload.text,
          }
        : {
            message: payload.text,
            link: payload.link || undefined,
          },
    };
  }

  if (platform === 'instagram') {
    return {
      endpoint: [
        'POST https://graph.facebook.com/v23.0/{instagram-business-account-id}/media',
        'POST https://graph.facebook.com/v23.0/{instagram-business-account-id}/media_publish',
      ],
      payload: {
        image_url: payload.imageUrl,
        caption: payload.caption || payload.text,
      },
    };
  }

  if (platform === 'linkedin') {
    return {
      endpoint: 'POST https://api.linkedin.com/rest/posts',
      payload: {
        author: '{linkedin-person-urn}',
        commentary: payload.text,
        visibility: 'PUBLIC',
        articleUrl: payload.link || undefined,
      },
    };
  }

  return {
    endpoint: 'unknown',
    payload: {},
  };
};

export default async (req) => {
  try {
    requireMethod(req);
    requireSocialAuth(req);
    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);
    const platform = payload.platform.toLowerCase();

    if (!platform) {
      throw new Error('Missing required field(s): platform');
    }

    return json({
      ok: true,
      platform,
      preview: buildPreview(platform, payload),
    });
  } catch (error) {
    return safeError(error);
  }
};
