const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function formatCurrency(value, currency = "USD") {
  const numericValue = Number(value || 0) / 100;
  const normalizedCurrency = String(currency || "USD").toUpperCase();

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizedCurrency,
    minimumFractionDigits: 2
  }).format(numericValue);
}

function buildLineItemSummary(lineItems) {
  return lineItems
    .map((item) => {
      const productName = String(item.productName || item.name || "Unknown item").trim() || "Unknown item";
      const quantity = Number(item.quantity || 1);
      const size = String(item.size || "").trim();
      const color = String(item.color || "").trim();
      const details = [size && `Size ${size}`, color && `Color ${color}`].filter(Boolean);
      const description = details.length ? ` (${details.join(", ")})` : "";
      return `${productName}${description} x${quantity}`;
    })
    .join("; ");
}

function buildOrderRowHtml(lineItems) {
  if (!lineItems.length) {
    return "<tr><td colspan='5' style='padding: 12px 0; color: #666;'>No items found.</td></tr>";
  }

  return lineItems.map((item) => {
    const quantity = Number(item.quantity || 1);
    const unitAmount = Number(item.unitAmount || 0);
    const totalAmount = Number(item.totalAmount || unitAmount * quantity);
    const price = formatCurrency(unitAmount, item.currency || "USD");
    const total = formatCurrency(totalAmount, item.currency || "USD");
    const size = String(item.size || "N/A").trim() || "N/A";
    const color = String(item.color || "N/A").trim() || "N/A";

    return `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${String(item.productName || "Unknown item").replace(/</g, "&lt;")}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${quantity}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${price}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">${size}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">${color}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${total}</td>
      </tr>
    `;
  }).join("");
}

function buildOrderEmail(order) {
  const amount = order.amountTotal != null
    ? formatCurrency(order.amountTotal, order.currency || "USD")
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

  const itemsSummary = buildLineItemSummary(order.lineItems || []);

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
    <div style="font-family: Arial, sans-serif; color: #111827; max-width: 760px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px;">New Safire Order</h2>
      <p><strong>Order ID:</strong> ${order.sessionId || "N/A"}</p>
      <p><strong>Date:</strong> ${orderDate}</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Customer:</strong> ${order.shipping?.name || "N/A"}</p>
      <p><strong>Email:</strong> ${order.customerEmail || "N/A"}</p>
      <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
      <p><strong>Shipping Address:</strong> ${addressLine || "N/A"}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background: #f9fafb; text-align: left;">
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Price</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Size</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Color</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${buildOrderRowHtml(order.lineItems || [])}
        </tbody>
      </table>
    </div>
  `;

  return { text, html };
}

function buildCustomerConfirmation(order) {
  const amount = order.amountTotal != null
    ? formatCurrency(order.amountTotal, order.currency || "USD")
    : "Unknown";

  const itemsSummary = buildLineItemSummary(order.lineItems || []);
  const shippingText = [
    order.shipping?.name,
    order.shipping?.line1,
    [order.shipping?.city, order.shipping?.state, order.shipping?.postal_code].filter(Boolean).join(", "),
    order.shipping?.country
  ].filter(Boolean).join("<br>");

  const text = [
    "Thank you for your order from Safire!",
    `Order ID: ${order.sessionId || "N/A"}`,
    `Amount: ${amount}`,
    `Items: ${itemsSummary || "N/A"}`,
    `Shipping: ${shippingText || "N/A"}`
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; max-width: 760px; margin: 0 auto;">
      <h1 style="margin-bottom: 8px;">Thanks for your Safire order</h1>
      <p style="margin-top: 0;">Order ID: <strong>${order.sessionId || "N/A"}</strong></p>
      <p><strong>Amount:</strong> ${amount}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background: #f9fafb; text-align: left;">
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Price</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Size</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Color</th>
            <th style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${buildOrderRowHtml(order.lineItems || [])}
        </tbody>
      </table>
      <p style="margin-top: 18px;"><strong>Shipping:</strong><br>${shippingText || "N/A"}</p>
      <p style="margin-top: 18px; color: #4b5563;">If you have any questions about your order, reply to this email and we’ll help.</p>
    </div>
  `;

  return { text, html };
}

function normalizeLineItem(lineItem) {
  const priceData = lineItem?.price || {};
  const productData = priceData.product || {};
  const productMetadata = productData.metadata || {};
  const productName = String(productMetadata.item_name || productData.name || lineItem?.description || "Unknown item").trim() || "Unknown item";
  const size = String(productMetadata.size || "").trim() || (String(lineItem?.description || "").match(/Size:\s*([^\n]+)/i)?.[1] || "").trim();
  const color = String(productMetadata.color || "").trim() || (String(lineItem?.description || "").match(/Color:\s*([^\n]+)/i)?.[1] || "").trim();
  const unitAmount = Number(priceData.unit_amount || lineItem?.amount_total || 0);
  const quantity = Number(lineItem?.quantity || 1);

  return {
    productName,
    quantity,
    unitAmount,
    totalAmount: Number(lineItem?.amount_total || unitAmount * quantity),
    currency: String(priceData.currency || "USD").toUpperCase(),
    size,
    color
  };
}

async function sendBrevoEmail({ toEmail, toName, subject, text, html }) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_TRANSACTIONAL_SENDER_EMAIL;

  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  if (!senderEmail) {
    throw new Error("BREVO_TRANSACTIONAL_SENDER_EMAIL is not configured.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": brevoApiKey
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: "Safire"
      },
      to: [{ email: toEmail, name: toName || toEmail }],
      subject,
      textContent: text,
      htmlContent: html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo send failed: ${response.status} ${errorText}`);
  }

  return response;
}

async function sendOrderEmails(order) {
  const ownerEmail = process.env.ORDER_ALERT_EMAIL;

  if (!ownerEmail) {
    console.warn("ORDER_ALERT_EMAIL not configured — skipping order email notifications.");
    return;
  }

  const ownerContent = buildOrderEmail(order);
  const customerContent = order.customerEmail ? buildCustomerConfirmation(order) : null;

  const tasks = [
    sendBrevoEmail({
      toEmail: ownerEmail,
      toName: "Safire Orders",
      subject: `New Safire Order — ${formatCurrency(order.amountTotal || 0, order.currency || "USD")}`,
      text: ownerContent.text,
      html: ownerContent.html
    })
  ];

  if (customerContent) {
    tasks.push(
      sendBrevoEmail({
        toEmail: order.customerEmail,
        toName: order.shipping?.name || "Customer",
        subject: "Your Safire Order Confirmation",
        text: customerContent.text,
        html: customerContent.html
      })
    );
  }

  await Promise.all(tasks);
}

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
          // Ignore metadata fallback failures and rely on actual Stripe line items below.
        }
      }

      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ["data.price.product"]
      });

      const lineItems = (lineItemsResponse.data || []).map(normalizeLineItem);
      const shipping = session.shipping_details?.address || session.customer_details?.address || {};

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
          itemsCount: metadata.items_count || null
        },
        lineItems,
        completedAt: stripeEvent.created
      };

      console.log("Stripe order completed:", JSON.stringify({
        sessionId: order.sessionId,
        customerEmail: order.customerEmail,
        itemCount: order.lineItems.length,
        amountTotal: order.amountTotal,
        currency: order.currency
      }));

      try {
        await sendOrderEmails(order);
      } catch (emailError) {
        console.error("Order email failed:", emailError);
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
