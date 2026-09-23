const https = require('https');

function createBrevoContact(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify(payload);

    const req = https.request(
      'https://api.brevo.com/v3/contacts',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
          'api-key': apiKey,
        },
      },
      (response) => {
        let rawData = '';

        response.on('data', (chunk) => {
          rawData += chunk;
        });

        response.on('end', () => {
          let parsed = null;
          if (rawData) {
            try {
              parsed = JSON.parse(rawData);
            } catch (_error) {
              parsed = null;
            }
          }

          resolve({
            status: response.statusCode || 500,
            data: parsed,
          });
        });
      }
    );

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed.' }),
    };
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (_error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Please send a valid JSON payload.' }),
    };
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Please enter a valid email address.' }),
    };
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email service is not configured yet.' }),
    };
  }

  const payload = { email, updateEnabled: true };
  const listIdRaw = process.env.BREVO_LIST_ID;
  if (listIdRaw) {
    const parsedListId = Number.parseInt(listIdRaw, 10);
    if (Number.isInteger(parsedListId)) {
      payload.listIds = [parsedListId];
    }
  }

  try {
    const brevoResponse = await createBrevoContact(payload, brevoApiKey);

    if (brevoResponse.status >= 200 && brevoResponse.status < 300) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Thanks for subscribing! You are on the list.' }),
      };
    }

    const message = brevoResponse.data?.message || '';
    const isDuplicate = (
      brevoResponse.status === 400 || brevoResponse.status === 409
    ) && /already exists|already subscribed|duplicate/i.test(message);

    if (isDuplicate) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'This email is already subscribed.' }),
      };
    }

    if (brevoResponse.status === 401 || brevoResponse.status === 403) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email service authentication failed. Please contact the site owner.' }),
      };
    }

    if (brevoResponse.status === 400 && message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message }),
      };
    }

    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Subscription provider error. Please try again in a moment.' }),
    };
  } catch (_error) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unable to reach email service. Please try again.' }),
    };
  }
};
