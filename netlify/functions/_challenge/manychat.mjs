import { readEnv } from './supabase.mjs';

const getManyChatApiKey = () => {
  const apiKey = readEnv('MANYCHAT_API_KEY');

  if (!apiKey) {
    const error = new Error('Missing MANYCHAT_API_KEY environment variable.');
    error.status = 503;
    throw error;
  }

  return apiKey;
};

const manyChatFetch = async (path, options = {}) => {
  const response = await fetch(`https://api.manychat.com${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${getManyChatApiKey()}`,
      accept: 'application/json',
      'content-type': 'application/json',
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      data?.error ||
      `ManyChat request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

export { manyChatFetch };
