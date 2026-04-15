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

function sanitizeMetadataValue(value, fallback) {
  const normalized = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return fallback;
  return normalized.slice(0, 500);
}

function buildMetadataChunkMap(prefix, rawValue, maxChunks = 8, chunkSize = 500) {
  const source = String(rawValue || "");
  if (!source) return {};

  const metadata = {};
  let index = 0;
  let chunkNumber = 1;

  while (index < source.length && chunkNumber <= maxChunks) {
    const chunk = source.slice(index, index + chunkSize);
    metadata[`${prefix}_${chunkNumber}`] = chunk;
    index += chunkSize;
    chunkNumber += 1;
  }

  if (index < source.length) {
    metadata[`${prefix}_truncated`] = "true";
  }

  return metadata;
}

function isValidStripePriceId(value) {
  return /^price_[A-Za-z0-9]+$/.test(String(value || "").trim());
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
        productId: sanitizeVariant(item.productId, "unknown-product"),
        productName: sanitizeVariant(item.name, "Safire Vintage Item"),
        selectedSize: sanitizeVariant(item.size, "default"),
        selectedColor: sanitizeVariant(item.color, "default"),
        selectedSizeLabel: sanitizeVariant(item.sizeLabel, sanitizeVariant(item.size, "default").toUpperCase()),
        selectedColorLabel: sanitizeVariant(item.colorLabel, sanitizeVariant(item.color, "default"))
      }));

    const invalidPriceItems = normalizedItems.filter((item) => !isValidStripePriceId(item.price));
    if (invalidPriceItems.length > 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Invalid Stripe price ID format: ${invalidPriceItems.map((item) => item.price).join(", ")}`
        })
      };
    }

    if (normalizedItems.length === 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No valid Stripe line items provided." })
      };
    }

    const firstItem = normalizedItems[0];
    const compactItems = normalizedItems.map((item) => ({
      id: item.productId,
      n: item.productName,
      q: item.quantity,
      s: item.selectedSizeLabel,
      c: item.selectedColorLabel
    }));

    const variantMap = sanitizeMetadataValue(JSON.stringify(compactItems), "[]");
    const allItemsJson = JSON.stringify(compactItems);
    const itemNames = sanitizeMetadataValue(normalizedItems.map((item) => item.productName).join(" | "), "");
    const itemSizes = sanitizeMetadataValue(normalizedItems.map((item) => item.selectedSizeLabel).join(" | "), "");
    const itemColors = sanitizeMetadataValue(normalizedItems.map((item) => item.selectedColorLabel).join(" | "), "");

    const itemsJsonMetadataChunks = buildMetadataChunkMap("items_json", allItemsJson);

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
              name: item.productName || productName,
              description: `Size: ${item.selectedSizeLabel}\nColor: ${item.selectedColorLabel}`,
              metadata: {
                product_id: item.productId,
                item_name: item.productName,
                size: item.selectedSizeLabel,
                color: item.selectedColorLabel,
                color_key: item.selectedColor
              }
            }
          }
        };
      })
    );

    const sharedMetadata = {
      product_name: firstItem.productName,
      size: firstItem.selectedSizeLabel,
      color: firstItem.selectedColorLabel,
      variant_map: variantMap,
      item_names: itemNames,
      item_sizes: itemSizes,
      item_colors: itemColors,
      items_count: String(normalizedItems.length),
      ...itemsJsonMetadataChunks
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      metadata: sharedMetadata,
      payment_intent_data: {
        metadata: sharedMetadata
      },
      shipping_address_collection: {
        allowed_countries: ["US"]
      },
      phone_number_collection: {
        enabled: true
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
