const json = (body, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });

const parseBody = async (req) => {
  try {
    return await req.json();
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
};

const requireMethod = (req, allowed = ['POST']) => {
  if (!allowed.includes(req.method)) {
    throw new Error(`Method ${req.method} not allowed. Use ${allowed.join(' or ')}.`);
  }
};

const readAuthToken = (req) => {
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  return (
    req.headers.get('x-social-posting-secret') ||
    req.headers.get('x-api-key') ||
    ''
  ).trim();
};

const requireSocialAuth = (req) => {
  const expectedSecret = process.env.SOCIAL_POSTING_SECRET;

  if (!expectedSecret) {
    throw new Error('Missing SOCIAL_POSTING_SECRET environment variable.');
  }

  const providedSecret = readAuthToken(req);
  if (!providedSecret || providedSecret !== expectedSecret) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
};

const requireFields = (payload, fields) => {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new Error(`Missing required field(s): ${missing.join(', ')}`);
  }
};

const trimPayload = (payload = {}) => ({
  text: payload.text?.trim() ?? '',
  link: payload.link?.trim() ?? '',
  imageUrl: payload.imageUrl?.trim() ?? '',
  caption: payload.caption?.trim() ?? '',
  title: payload.title?.trim() ?? '',
  altText: payload.altText?.trim() ?? '',
  platform: payload.platform?.trim() ?? '',
  postId: payload.postId?.trim() ?? '',
});

const safeError = (error, status = 400) =>
  json(
    {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    },
    error?.status || status,
  );

const fetchJsonDetailed = async (url, options) => {
  const response = await fetch(url, options);
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Remote API request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return {
    data,
    headers: response.headers,
    status: response.status,
  };
};

const fetchJson = async (url, options) => {
  const result = await fetchJsonDetailed(url, options);
  return result.data;
};

export {
  fetchJson,
  fetchJsonDetailed,
  json,
  parseBody,
  requireFields,
  requireSocialAuth,
  requireMethod,
  safeError,
  trimPayload,
};
