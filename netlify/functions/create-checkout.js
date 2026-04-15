const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function isValidStripePriceId(value) {
  return /^price_[A-Za-z0-9]+$/.test(String(value || "").trim());
}

exports.handler = async function(event) {

  const data = JSON.parse(event.body || "{}");

  try {
    const origin = event.headers?.origin || process.env.URL || "https://safire1.netlify.app";

    let lineItems = [];

    if (Array.isArray(data.items) && data.items.length > 0) {
      lineItems = data.items
        .filter((item) => item && item.priceId)
        .map((item) => ({
          price: item.priceId,
          quantity: Math.max(1, Number(item.quantity) || 1)
        }));
    } else if (data.priceId) {
      lineItems = [
        {
          price: data.priceId,
          quantity: Math.max(1, Number(data.quantity) || 1)
        }
      ];
    }

    if (lineItems.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No valid Stripe line items provided." })
      };
    }

    const invalidLineItems = lineItems.filter((item) => !isValidStripePriceId(item.price));
    if (invalidLineItems.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Invalid Stripe price ID format: ${invalidLineItems.map((item) => item.price).join(", ")}`
        })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${origin}/cart.html?checkout=success`,
      cancel_url: `${origin}/cart.html?checkout=cancel`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };

  }

};