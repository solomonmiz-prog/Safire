const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function formatOrderItemSummary(order) {
  const meta = order.metadata || {};
  const itemNames = meta.itemNames ? meta.itemNames.split(" | ") : [meta.productName || ""];
  const itemSizes = meta.itemSizes ? meta.itemSizes.split(" | ") : [meta.size || ""];
  const itemColors = meta.itemColors ? meta.itemColors.split(" | ") : [meta.color || ""];

  return itemNames
    .map((name, index) => {
      const safeName = String(name || "").trim() || "Unknown item";
      const safeSize = String(itemSizes[index] || "").trim().toUpperCase();
      const safeColor = String(itemColors[index] || "").trim();
      const detail = [safeSize && `Size ${safeSize}`, safeColor && `Color ${safeColor}`]
        .filter(Boolean)
        .join(", ");

      return detail ? `${safeName} (${detail})` : safeName;
    })
    .join("; ");
}

function buildOrderEmail(order) {
  const amount = order.amountTotal != null
    ? `$${(order.amountTotal / 100).toFixed(2)} ${String(order.currency || "USD").toUpperCase()}`
    : "Unknown";

  const orderDate = order.completedAt
    ? new Date(order.completedAt * 1000).toLocaleString("en-US", { timeZone: "America/New_York" })
    : new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  const addressLine = [
    order.shipping?.line1,
    order.shipping?.line2,
    order.shipping?.city,
    order.shipping?.state,
    order.shipping?.postal_code,
    order.shipping?.country
  ].filter(Boolean).join(", ");

  const itemsSummary = formatOrderItemSummary(order);

  const text = [
    "New Stripe Order",
    `Order ID: ${order.sessionId || "N/A"}`,
    `Date: ${orderDate}`,
    `Amount: ${amount}`,
    `Customer: ${order.shipping?.name || "N/A"}`,
    `Email: ${order.customerEmail || "N/A"}`,
    `Phone: ${order.phone || "N/A"}`,
    `Items: ${itemsSummary || "N/A"}`,
    `Shipping Address: ${addressLine || "N/A"}`
  ].join("\n");

  const html = `
    <h2>New Stripe Order</h2>
    <p><strong>Order ID:</strong> ${order.sessionId || "N/A"}</p>
    <p><strong>Date:</strong> ${orderDate}</p>
    <p><strong>Amount:</strong> ${amount}</p>
    <p><strong>Customer:</strong> ${order.shipping?.name || "N/A"}</p>
    <p><strong>Email:</strong> ${order.customerEmail || "N/A"}</p>
    <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
    <p><strong>Items:</strong> ${itemsSummary || "N/A"}</p>
    <p><strong>Shipping Address:</strong> ${addressLine || "N/A"}</p>
  `;

  return { text, html };
}

function buildCustomerConfirmation(order) {
  const amount = order.amountTotal != null
    ? `$${(order.amountTotal / 100).toFixed(2)} ${String(order.currency || "USD").toUpperCase()}`
    : "Unknown";

  const itemsSummary = formatOrderItemSummary(order);

  const text = [
    `Thank you for your order from Safire!`,
    `Order ID: ${order.sessionId || "N/A"}`,
    `Amount: ${amount}`,
    `Items: ${itemsSummary || "N/A"}`,
    `Shipping: ${order.shipping?.name || "N/A"} — ${order.shipping?.line1 || ""} ${order.shipping?.city || ""}`
  ].join('\n');

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111;">
      <h1 style="margin-bottom:0.25rem">Thanks for your Safire order</h1>
      <p style="margin-top:0">Order ID: <strong>${order.sessionId || "N/A"}</strong></p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Items:</strong> ${itemsSummary || "N/A"}</p>
      <p><strong>Shipping:</strong> ${order.shipping?.name || "N/A"}<br>${[order.shipping?.line1, order.shipping?.city, order.shipping?.state, order.shipping?.postal_code].filter(Boolean).join(', ')}</p>
      <p style="margin-top:1rem">If you have questions, reply to this email.</p>
      <hr>
      <p style="color:#666;font-size:12px;margin-top:8px">Safire — Streetwear essentials</p>
    </div>
  `;

  return { text, html };
}

async function sendOrderEmails(order) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.ORDER_ALERT_EMAIL;
  const fromEmail = process.env.ORDER_FROM_EMAIL || "orders@safirevintage.com";

  if (!resendApiKey || !ownerEmail) {
    console.warn("Resend or owner email not configured — skipping emails.");
    return;
  }

  // Owner email
  const ownerContent = buildOrderEmail(order);
  const ownerPayload = {
    from: fromEmail,
    to: [ownerEmail],
    subject: `New Safire Order — ${order.amountTotal != null ? `$${(order.amountTotal/100).toFixed(2)}` : ''}`.trim(),
    html: ownerContent.html,
    text: ownerContent.text
  };

  // Customer email (if available)
  let customerPayload = null;
  if (order.customerEmail) {
    const customerContent = buildCustomerConfirmation(order);
    customerPayload = {
      from: fromEmail,
      to: [order.customerEmail],
      subject: 'Your Safire Order Confirmation',
      html: customerContent.html,
      text: customerContent.text
    };
  }

  const send = async (payload) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend send failed: ${res.status} ${errText}`);
    }
    return res;
  };

  const tasks = [send(ownerPayload)];
  if (customerPayload) tasks.push(send(customerPayload));

  await Promise.all(tasks);
}

// Google Sheets integration removed — orders now only send emails via Resend

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

      if ((!metadata.size || !metadata.color || !metadata.product_name || !metadata.name) && session.payment_intent) {
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
          productName: metadata.product_name || metadata.name || null,
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

      const [sheetResult, emailResult] = await Promise.allSettled([
        appendOrderToSheet(order),
        sendOrderEmail(order)
      ]);

      if (sheetResult.status === "rejected") {
        console.error("Sheet append failed:", sheetResult.reason);
      }

      if (emailResult.status === "rejected") {
        console.error("Order email failed:", emailResult.reason);
      }
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
