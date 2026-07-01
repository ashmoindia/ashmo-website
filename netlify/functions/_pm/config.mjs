const readEnv = (name) => globalThis.Netlify?.env?.get?.(name) ?? process.env[name];

const requiredEnv = (name) => {
  const value = readEnv(name);
  if (!value) {
    const error = new Error(`Missing ${name}.`);
    error.status = 503;
    throw error;
  }
  return value;
};

const getPmConfig = () => ({
  supabaseUrl: requiredEnv('SUPABASE_URL').replace(/\/$/, ''),
  serviceRoleKey: requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  contentEncryptionKey: requiredEnv('PM_CONTENT_ENCRYPTION_KEY'),
  sessionSecret: requiredEnv('PM_SESSION_SECRET'),
  cleanupSecret: readEnv('PM_CLEANUP_SECRET') || '',
});

export { getPmConfig, readEnv, requiredEnv };
