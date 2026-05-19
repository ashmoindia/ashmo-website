const readEnv = (key) => {
  if (globalThis.Netlify?.env?.get) {
    return globalThis.Netlify.env.get(key);
  }

  return process.env[key];
};

const getSupabaseConfig = () => {
  const url = readEnv('SUPABASE_URL')?.replace(/\/$/, '');
  const serviceRoleKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
};

const supabaseFetch = async (path, options = {}) => {
  const config = getSupabaseConfig();

  if (!config) {
    const error = new Error('Missing Supabase environment variables.');
    error.status = 503;
    throw error;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
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
    const message = data?.message || data?.error || `Supabase request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

export { readEnv, supabaseFetch };
