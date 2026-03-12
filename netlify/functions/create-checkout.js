const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PRODUCT_PRICE_IDS = {
  "art-hoodie": "price_1T9ymc9S93tBM5OXJQyDUhbC",
  "brown-hoodie": "price_1T9ymc9S93tBM5OXJQyDUhbC",
  "socrates-hoodie": "price_1T9yom9S93tBM5OXxuh5loMF",
  "black-socrates-hoodie": "price_1T9yom9S93tBM5OXxuh5loMF",
  "classic-quarter-zip": "price_1T9yqp9S93tBM5OX9uorrP1S",
  "varsity-jacket": "price_1T9ytB9S93tBM5OXJmSgGvri",
  "plain-hoodie": "price_1T9yuQ9S93tBM5OX1OfqNOOo",
  "cropped-fleece-hoodie": "price_1T9yuQ9S93tBM5OX1OfqNOOo"
};

const ALLOWED_PRICE_IDS = new Set(Object.values(PRODUCT_PRICE_IDS));

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function resolvePriceId(data) {
  const productKeys = [
    data.productId,
    data.productKey,
    data.productName,
    data.name
  ].map(normalizeKey).filter(Boolean);

  for (const key of productKeys) {
    if (PRODUCT_PRICE_IDS[key]) {
      return PRODUCT_PRICE_IDS[key];
    }
  }

  const providedPriceId = String(data.priceId || "").trim();
  if (ALLOWED_PRICE_IDS.has(providedPriceId)) {
    return providedPriceId;
  }

  return null;
}

function sanitizeMetadataValue(value) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function buildLineItem(item) {
  const resolvedPriceId = resolvePriceId(item || {});
  if (!resolvedPriceId) return null;

  return {
    price: resolvedPriceId,
    quantity: Math.max(1, Number(item.quantity) || 1)
  };
}

exports.handler = async function(event) {
  try {
    const data = JSON.parse(event.body || "{}");
    let lineItems = [];
    let metadata = {
      size: sanitizeMetadataValue(data.size || "default"),
      color: sanitizeMetadataValue(data.color || "default")
    };

    if (Array.isArray(data.items) && data.items.length > 0) {
      lineItems = data.items
        .map((item) => buildLineItem(item))
        .filter(Boolean);

      if (lineItems.length !== data.items.length) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "One or more items have an invalid product or price ID." })
        };
      }

      metadata = {
        size: "multiple",
        color: "multiple"
      };
    } else {
      const singleLineItem = buildLineItem(data);
      if (!singleLineItem) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid product or price ID." })
        };
      }
      lineItems = [singleLineItem];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata,
      payment_intent_data: {
        metadata
      },
      success_url: "https://safire1.netlify.app/success.html",
      cancel_url: "https://safire1.netlify.app/cart.html"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: session.url
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to create checkout session." })
    };
  }

};