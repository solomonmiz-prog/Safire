# Safire
streetwear clothing brand

## Local Checkout Setup (Single Stripe Payment for Full Cart)

1. Install dependencies:

	npm install

2. Create your env file:

	cp .env.example .env

3. Add your Stripe secret key in `.env`:

	STRIPE_SECRET_KEY=sk_live_or_sk_test_key_here

4. Start the app:

	npm start

5. Open:

	http://localhost:4242

Checkout now creates one Stripe Checkout Session for the full cart total (all items together) instead of opening multiple payment links.
