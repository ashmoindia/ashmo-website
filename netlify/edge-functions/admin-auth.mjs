const unauthorized = () =>
  new Response('Admin authentication required.', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Ashmo Admin"',
      'cache-control': 'no-store',
    },
  });

const parseBasicAuth = (req) => {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('basic ')) return null;

  try {
    const decoded = atob(authHeader.slice(6));
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) return null;

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
};

export default async (req, context) => {
  const expectedUsername = Netlify.env.get('ADMIN_USERNAME') || 'ashmo';
  const expectedPassword = Netlify.env.get('ADMIN_PASSWORD');

  if (!expectedPassword) {
    return new Response('Admin password is not configured.', {
      status: 503,
      headers: { 'cache-control': 'no-store' },
    });
  }

  const credentials = parseBasicAuth(req);
  if (credentials?.username !== expectedUsername || credentials?.password !== expectedPassword) {
    return unauthorized();
  }

  const response = await context.next();
  response.headers.set('cache-control', 'no-store');
  return response;
};

export const config = {
  path: '/admin/*',
};
