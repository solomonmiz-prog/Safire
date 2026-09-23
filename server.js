require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const port = process.env.PORT || 4242;

app.use(express.json());
app.use(express.static(__dirname));

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

app.post('/api/subscribe', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    return res.status(500).json({ error: 'Email service is not configured yet.' });
  }

  const payload = {
    email,
    updateEnabled: true,
  };

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
      return res.json({ message: 'Thanks for subscribing! You are on the list.' });
    }

    const message = brevoResponse.data?.message || '';
    const isDuplicate = (
      brevoResponse.status === 400 || brevoResponse.status === 409
    ) && /already exists|already subscribed|duplicate/i.test(message);

    if (isDuplicate) {
      return res.json({ message: 'This email is already subscribed.' });
    }

    if (brevoResponse.status === 401 || brevoResponse.status === 403) {
      return res.status(500).json({ error: 'Email service authentication failed. Please contact the site owner.' });
    }

    if (brevoResponse.status === 400 && message) {
      return res.status(400).json({ error: message });
    }

    return res.status(502).json({ error: 'Subscription provider error. Please try again in a moment.' });
  } catch (_error) {
    return res.status(502).json({ error: 'Unable to reach email service. Please try again.' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Safire server running on http://localhost:${port}`);
});
