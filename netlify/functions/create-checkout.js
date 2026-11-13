function getStripeSecretKey() {
  const candidates = [
    "STRIPE_SECRET_KEY",
    "STRIPE_BLACK_FRIDAY_KEY",
    "STRIPE_BLACK_FRIDAY_SECRET_KEY"
  ];

  for (const key of candidates) {
    const value = String(process.env[key] || "").trim();
    if (value) {
      return value;
    }
  }

  throw new Error("Missing required Stripe secret key. Set STRIPE_SECRET_KEY or STRIPE_BLACK_FRIDAY_KEY in your environment.");
}

const stripe = require("stripe")(getStripeSecretKey());

function isValidStripePriceId(value) {
  return /^price_[A-Za-z0-9]+$/.test(String(value || "").trim());
}

function getActiveCouponConfig() {
  // Stripe promo codes are configured in Stripe and entered by the shopper at checkout.
  // Hard-coding a coupon here prevents the manual code field from appearing and can
  // bypass the promotion code that was created as BLKFDY.
  return {
    allow_promotion_codes: true
  };
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

    const stripeLineItems = await Promise.all(
      lineItems.map(async (lineItem, index) => {
        const stripePrice = await stripe.prices.retrieve(lineItem.price, { expand: ["product"] });
        const unitAmount = stripePrice.unit_amount;
        const currency = stripePrice.currency;
        const fallbackName = typeof stripePrice.product === "object" ? stripePrice.product.name : "Safire Vintage Item";
        const itemMeta = normalizedItems[index] || firstItem;

        return {
          quantity: lineItem.quantity,
          price_data: {
            currency,
            unit_amount: Number(unitAmount || 0),
            product_data: {
              name: itemMeta.name || fallbackName,
              description: `Size: ${itemMeta.size}\nColor: ${itemMeta.color}`
            }
          }
        };
      })
    );

    const blackFridayCouponConfig = getActiveCouponConfig();

    const sessionParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      metadata: sharedMetadata,
      payment_intent_data: {
        metadata: sharedMetadata
      },
      ...blackFridayCouponConfig,
      success_url: `${origin}/cart.html?checkout=success`,
      cancel_url: `${origin}/cart.html?checkout=cancel`
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

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