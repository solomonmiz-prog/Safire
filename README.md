# Safire
streetwear clothing brand

## Local Checkout Setup (Single Stripe Payment for Full Cart)

1. Install dependencies:

	npm install

2. Create your env file:

	cp .env.example .env

3. Add your Stripe keys in `.env`:

	STRIPE_SECRET_KEY=sk_live_or_sk_test_key_here
	STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_key_here

4. Start the app:

	npm start

5. Open:

	http://localhost:4242

Checkout now creates one Stripe Checkout Session for the full cart total and the frontend redirects with Stripe.js `redirectToCheckout({ sessionId })`.
