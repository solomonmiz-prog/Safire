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

    const lineItems = cart.map((item) => {
      const name = String(item.name || 'SAFIRE Item').trim();
      const size = String(item.size || '').trim().toUpperCase();
      const color = String(item.color || '').trim();
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitAmountCents = Math.round((Number(item.price) || 0) * 100);

      if (unitAmountCents <= 0) {
        throw new Error(`Invalid price for ${name}`);
      }

      return {
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: unitAmountCents,
          product_data: {
            name,
            description: [
              color ? `Color: ${color}` : null,
              size ? `Size: ${size}` : null
            ]
              .filter(Boolean)
              .join(' · ')
          }
        }
      };
    });

    const origin = req.headers.origin || `http://localhost:${port}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/cart.html?checkout=success`,
      cancel_url: `${origin}/cart.html?checkout=cancel`
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to create checkout session.' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Safire server running on http://localhost:${port}`);
});
