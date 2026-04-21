const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function isValidStripePriceId(value) {
  return /^price_[A-Za-z0-9]+$/.test(String(value || "").trim());
}

function sanitizeMetadataValue(value, fallback, maxLength = 500) {
  const normalized = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return fallback;
  return normalized.slice(0, maxLength);
}

exports.handler = async function(event) {

  const data = JSON.parse(event.body || "{}");

  try {
    const origin = event.headers?.origin || process.env.URL || "https://safire1.netlify.app";

    let lineItems = [];
    let normalizedItems = [];

    if (Array.isArray(data.items) && data.items.length > 0) {
      normalizedItems = data.items
        .filter((item) => item && item.priceId)
        .map((item) => ({
          priceId: String(item.priceId).trim(),
          quantity: Math.max(1, Number(item.quantity) || 1),
          name: sanitizeMetadataValue(item.name, "Safire Vintage Item", 120),
          size: sanitizeMetadataValue(item.sizeLabel || item.size, "default", 120),
          color: sanitizeMetadataValue(item.colorLabel || item.color, "default", 120)
        }));

      lineItems = normalizedItems
        .filter((item) => item && item.priceId)
        .map((item) => ({
          price: item.priceId,
          quantity: Math.max(1, Number(item.quantity) || 1)
        }));
    } else if (data.priceId) {
      normalizedItems = [
        {
          priceId: String(data.priceId).trim(),
          quantity: Math.max(1, Number(data.quantity) || 1),
          name: sanitizeMetadataValue(data.name, "Safire Vintage Item", 120),
          size: sanitizeMetadataValue(data.sizeLabel || data.size, "default", 120),
          color: sanitizeMetadataValue(data.colorLabel || data.color, "default", 120)
        }
      ];

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

    const firstItem = normalizedItems[0] || {
      name: "Safire Vintage Item",
      size: "default",
      color: "default"
    };

    const sharedMetadata = {
      product_name: firstItem.name,
      name: firstItem.name,
      size: firstItem.size,
      color: firstItem.color,
      item_names: sanitizeMetadataValue(normalizedItems.map((item) => item.name).join(" | "), ""),
      item_sizes: sanitizeMetadataValue(normalizedItems.map((item) => item.size).join(" | "), ""),
      item_colors: sanitizeMetadataValue(normalizedItems.map((item) => item.color).join(" | "), ""),
      items_count: String(normalizedItems.length)
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: sharedMetadata,
      payment_intent_data: {
        metadata: sharedMetadata
      },
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