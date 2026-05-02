// Netlify serverless function — proxies requests to the Meraki API
// This bypasses CORS restrictions that prevent direct browser requests
// The API key is passed in the request header and forwarded to Meraki
// It is never stored, logged, or retained by this function

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Extract the Meraki API path from the request
  // e.g. /api/organizations → https://api.meraki.com/api/v1/organizations
  const path = event.path.replace('/api', '');
  const merakiUrl = `https://api.meraki.com/api/v1${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;

  // Get the API key from the request header
  const apiKey = event.headers['x-meraki-key'];
  if (!apiKey) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing API key' })
    };
  }

  try {
    const response = await fetch(merakiUrl, {
      method: 'GET',
      headers: {
        'X-Cisco-Meraki-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-meraki-key, Content-Type'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Proxy error: ' + error.message })
    };
  }
};
