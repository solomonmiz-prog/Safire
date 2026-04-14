const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET environment variable."
      })
    };
  }

  try {
    const signature = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

    if (!signature) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing Stripe signature header." })
      };
    }

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : (event.body || "");

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      let metadata = session.metadata || {};

      if ((!metadata.size || !metadata.color) && session.payment_intent) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
          if (paymentIntent && paymentIntent.metadata) {
            metadata = {
              ...paymentIntent.metadata,
              ...metadata
            };
          }
        } catch (_paymentIntentError) {
        }
      }

      const shipping = session.shipping_details?.address
        || session.customer_details?.address
        || {};

      const order = {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email || null,
        phone: session.customer_details?.phone || null,
        amountTotal: session.amount_total,
        currency: session.currency,
        shipping: {
          name: session.shipping_details?.name || session.customer_details?.name || null,
          line1: shipping.line1 || null,
          line2: shipping.line2 || null,
          city: shipping.city || null,
          state: shipping.state || null,
          postal_code: shipping.postal_code || null,
          country: shipping.country || null
        },
        metadata: {
          productName: metadata.product_name || null,
          size: metadata.size || null,
          color: metadata.color || null,
          variantMap: metadata.variant_map || null,
          itemNames: metadata.item_names || null,
          itemSizes: metadata.item_sizes || null,
          itemColors: metadata.item_colors || null,
          itemsCount: metadata.items_count || null,
          itemsJson1: metadata.items_json_1 || null,
          itemsJson2: metadata.items_json_2 || null,
          itemsJson3: metadata.items_json_3 || null,
          itemsJson4: metadata.items_json_4 || null,
          itemsJson5: metadata.items_json_5 || null,
          itemsJson6: metadata.items_json_6 || null,
          itemsJson7: metadata.items_json_7 || null,
          itemsJson8: metadata.items_json_8 || null,
          itemsJsonTruncated: metadata.items_json_truncated || null
        },
        completedAt: stripeEvent.created
      };

      console.log("Stripe order completed:", JSON.stringify(order));
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Webhook Error: ${error.message}` })
    };
  }
};
