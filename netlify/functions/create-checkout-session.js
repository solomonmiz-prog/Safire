const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function sanitizeVariant(value, fallback) {
  const normalized = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return fallback;
  return normalized.slice(0, 120);
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY environment variable." })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const requestItems = Array.isArray(data.items)
      ? data.items
      : (data.priceId ? [data] : []);

    const normalizedItems = requestItems
      .filter((item) => item && item.priceId)
      .map((item) => ({
        price: String(item.priceId).trim(),
        quantity: Math.max(1, Number(item.quantity) || 1),
        selectedSize: sanitizeVariant(item.size, "default"),
        selectedColor: sanitizeVariant(item.color, "default")
      }));

    if (normalizedItems.length === 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No valid Stripe line items provided." })
      };
    }

    const firstItem = normalizedItems[0];
    const variantMap = JSON.stringify(
      normalizedItems.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      }))
    ).slice(0, 500);

    const stripeLineItems = await Promise.all(
      normalizedItems.map(async (item) => {
        const stripePrice = await stripe.prices.retrieve(item.price, {
          expand: ["product"]
        });

        const productName = typeof stripePrice.product === "object"
          ? stripePrice.product.name
          : "Safire Vintage Item";

        const currency = stripePrice.currency;
        const unitAmount = stripePrice.unit_amount;

        if (!currency || !Number.isInteger(unitAmount)) {
          throw new Error(`Price ${item.price} is missing currency or unit amount.`);
        }

        return {
          quantity: item.quantity,
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              description: `Size: ${item.selectedSize.toUpperCase()} | Color: ${item.selectedColor}`
            }
          }
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      metadata: {
        size: firstItem.selectedSize,
        color: firstItem.selectedColor,
        variant_map: variantMap
      },
      payment_intent_data: {
        metadata: {
          size: firstItem.selectedSize,
          color: firstItem.selectedColor,
          variant_map: variantMap
        }
      },
      success_url: "https://safirevintage.com/success",
      cancel_url: "https://safirevintage.com/cart"
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Failed to create checkout session." })
    };
  }
};
