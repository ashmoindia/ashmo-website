import { getPmConfig } from './config.mjs';

const parseResponse = async (response) => {
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
    const error = new Error(data?.message || data?.error || `Storage request failed (${response.status}).`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
};

const serviceHeaders = (extra = {}) => {
  const { serviceRoleKey } = getPmConfig();
  return {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    ...extra,
  };
};

const databaseFetch = async (path, options = {}) => {
  const { supabaseUrl } = getPmConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: serviceHeaders({
      'content-type': 'application/json',
      ...options.headers,
    }),
  });
  return parseResponse(response);
};

const storageFetch = async (path, options = {}) => {
  const { supabaseUrl } = getPmConfig();
  const response = await fetch(`${supabaseUrl}/storage/v1/${path}`, {
    ...options,
    headers: serviceHeaders(options.headers),
  });
  return parseResponse(response);
};

export { databaseFetch, storageFetch };
