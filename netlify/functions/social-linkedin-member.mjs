import {
  fetchJson,
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
const LINKEDIN_IMAGES_URL = 'https://api.linkedin.com/rest/images?action=initializeUpload';
const DEFAULT_LINKEDIN_VERSION = '202502';

const linkedinHeaders = (accessToken, linkedinVersion, extra = {}) => ({
  Authorization: `Bearer ${accessToken}`,
  'LinkedIn-Version': linkedinVersion,
  'X-Restli-Protocol-Version': '2.0.0',
  ...extra,
});

const uploadLinkedinImage = async ({ accessToken, authorUrn, imageUrl, linkedinVersion }) => {
  const initialize = await fetchJson(LINKEDIN_IMAGES_URL, {
    method: 'POST',
    headers: linkedinHeaders(accessToken, linkedinVersion, {
      'content-type': 'application/json',
    }),
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: authorUrn,
      },
    }),
  });

  const uploadUrl = initialize.value?.uploadUrl;
  const imageUrn = initialize.value?.image;

  if (!uploadUrl || !imageUrn) {
    throw new Error('LinkedIn image upload initialization failed.');
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Could not fetch LinkedIn image source (${imageResponse.status}).`);
  }

  const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';
  const imageBuffer = await imageResponse.arrayBuffer();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'content-type': contentType,
    },
    body: imageBuffer,
  });

  if (!uploadResponse.ok) {
    const raw = await uploadResponse.text();
    throw new Error(raw || `LinkedIn image upload failed with status ${uploadResponse.status}.`);
  }

  return imageUrn;
};

export default async (req) => {
  try {
    requireMethod(req);
    requireSocialAuth(req);

    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn = process.env.LINKEDIN_AUTHOR_URN;
    const linkedinVersion = process.env.LINKEDIN_API_VERSION || DEFAULT_LINKEDIN_VERSION;

    if (!accessToken || !authorUrn) {
      throw new Error('Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_AUTHOR_URN environment variable.');
    }

    const rawPayload = await parseBody(req);
    const payload = trimPayload(rawPayload);
    requireFields(payload, ['text']);

    const body = {
      author: authorUrn,
      commentary: payload.text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    if (payload.imageUrl) {
      const imageUrn = await uploadLinkedinImage({
        accessToken,
        authorUrn,
        imageUrl: payload.imageUrl,
        linkedinVersion,
      });

      body.content = {
        media: {
          id: imageUrn,
          ...(payload.altText ? { altText: payload.altText } : {}),
        },
      };
    }

    const result = await fetchJsonDetailed(LINKEDIN_POSTS_URL, {
      method: 'POST',
      headers: linkedinHeaders(accessToken, linkedinVersion, {
        'content-type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    return json({
      ok: true,
      platform: 'linkedin',
      postId: result.headers.get('x-restli-id') || '',
      data: result.data,
    });
  } catch (error) {
    return safeError(error);
  }
};
