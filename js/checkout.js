let stripeClientPromise = null;

async function getStripeClient() {
    if (stripeClientPromise) return stripeClientPromise;

    stripeClientPromise = (async () => {
        if (typeof window.Stripe !== 'function') {
            throw new Error('Stripe.js failed to load.');
        }

        const response = await fetch('/stripe-config');
        const payload = await response.json();

        if (!response.ok || !payload.publishableKey) {
            throw new Error(payload.error || 'Stripe publishable key is missing.');
        }

        const publishableKey = String(payload.publishableKey).trim();
        if (!publishableKey.startsWith('pk_')) {
            throw new Error('Invalid Stripe publishable key format.');
        }

        return window.Stripe(publishableKey);
    })();

    return stripeClientPromise;
}

async function startStripeRedirectToCheckout(sessionId) {
    const safeSessionId = String(sessionId || '').trim();
    if (!safeSessionId.startsWith('cs_')) {
        throw new Error('Invalid Stripe Checkout session ID.');
    }

    const stripe = await getStripeClient();
    const result = await stripe.redirectToCheckout({
        sessionId: safeSessionId
    });

    if (result && result.error && result.error.message) {
        throw new Error(result.error.message);
    }
}
