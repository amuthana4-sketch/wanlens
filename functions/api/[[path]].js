// Cloudflare Pages Function — proxies requests to the Meraki API
// Bypasses CORS restrictions that prevent direct browser requests
// The API key is passed in a custom header and forwarded to Meraki
// It is never stored, logged, or retained by this function

export async function onRequest(context) {
  const { request, params } = context;

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-meraki-key, Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    });
  }

  // Get API key from custom header
  const apiKey = request.headers.get('x-meraki-key');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Build Meraki API URL from the request path
  // e.g. /api/organizations → https://api.meraki.com/api/v1/organizations
  const url = new URL(request.url);
  const merakiPath = url.pathname.replace('/api', '');
  const merakiUrl = `https://api.meraki.com/api/v1${merakiPath}${url.search}`;

  try {
    const response = await fetch(merakiUrl, {
      method: 'GET',
      headers: {
        'X-Cisco-Meraki-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-meraki-key, Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy error: ' + error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

