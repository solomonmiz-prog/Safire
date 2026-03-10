require('dotenv').config();
const express = require('express');
const path = require('path');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 4242;

app.use(express.json());
app.use(express.static(__dirname));

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function getStripeMode(secretKey) {
  if (!secretKey) return null;
  if (secretKey.startsWith('sk_live_')) return 'live';
  if (secretKey.startsWith('sk_test_')) return 'test';
  return null;
}

function toNonEmptyString(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function sanitizeStripeString(value, maxLength) {
  const normalized = toNonEmptyString(value)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return '';
  if (!maxLength || normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength).trim();
}

function normalizeBaseUrl(value, fallbackPort) {
  const raw = toNonEmptyString(value);
  if (!raw || raw === 'null' || raw === 'undefined') {
    return `http://localhost:${fallbackPort}`;
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return `http://localhost:${fallbackPort}`;
    }
    return parsed.origin;
  } catch (_error) {
    return `http://localhost:${fallbackPort}`;
  }
}

function isValidAbsoluteUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

function sanitizeCartItem(item, index) {
  const name = sanitizeStripeString(item?.name || item?.productName || item?.title, 120);
  const descriptionInput = sanitizeStripeString(item?.description, 300);
  const color = sanitizeStripeString(item?.color, 80);
  const size = sanitizeStripeString(item?.size, 30).toUpperCase();
  const quantity = Number(item?.quantity);
  const priceId = toNonEmptyString(item?.priceId);

  if (!name) {
    throw new Error(`Cart item #${index + 1} is missing a product name.`);
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error(`Cart item #${index + 1} has an invalid quantity.`);
  }

  const safeQuantity = Math.floor(quantity);
  if (safeQuantity <= 0) {
    throw new Error(`Cart item #${index + 1} has an invalid quantity.`);
  }

  const hasValidPriceId = /^price_[A-Za-z0-9]+$/.test(priceId);

  if (!hasValidPriceId) {
    throw new Error(`Cart item #${index + 1} is missing a valid Stripe price ID (price_...).`);
  }

  const generatedDescription = [
    color ? `Color: ${color}` : null,
    size ? `Size: ${size}` : null
  ]
    .filter(Boolean)
    .join(' · ');

  const description = descriptionInput || generatedDescription;

  return {
    name,
    description,
    quantity: safeQuantity,
    priceId
  };
}

function buildLineItem(item, index, stripeMode) {
  const priceIdMode = item.priceId.includes('_live_') ? 'live' : item.priceId.includes('_test_') ? 'test' : null;
  if (stripeMode && priceIdMode && stripeMode !== priceIdMode) {
    throw new Error(`Cart item #${index + 1} uses a ${priceIdMode} price ID with a ${stripeMode} secret key.`);
  }

  return {
    quantity: item.quantity,
    price: item.priceId
  };
}

app.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        error: 'Missing STRIPE_SECRET_KEY. Add it to your .env file before checkout.'
      });
    }

    const cart = Array.isArray(req.body?.cart) ? req.body.cart : [];
    if (cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const stripeMode = getStripeMode(stripeSecretKey);
    const sanitizedCart = cart.map((item, index) => sanitizeCartItem(item, index));
    const lineItems = sanitizedCart.map((item, index) => buildLineItem(item, index, stripeMode));

    const requestOrigin = toNonEmptyString(req.headers.origin);
    const baseUrl = normalizeBaseUrl(toNonEmptyString(process.env.PUBLIC_BASE_URL) || requestOrigin, port);
    const successUrl = `${baseUrl}/cart.html?checkout=success`;
    const cancelUrl = `${baseUrl}/cart.html?checkout=cancel`;

    if (!isValidAbsoluteUrl(successUrl) || !isValidAbsoluteUrl(cancelUrl)) {
      return res.status(500).json({ error: 'Invalid checkout redirect URLs. Check PUBLIC_BASE_URL or request origin.' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe Checkout Error]', {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      param: error?.param,
      requestId: error?.requestId
    });

    const details = [error?.message, error?.param ? `param: ${error.param}` : null]
      .filter(Boolean)
      .join(' | ');

    return res.status(500).json({
      error: details || 'Unable to create checkout session.',
      type: error?.type || 'unknown_error',
      code: error?.code || null,
      param: error?.param || null
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Safire server running on http://localhost:${port}`);
});
