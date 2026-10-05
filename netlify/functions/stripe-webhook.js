const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function normalizeCatalogValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadStorefrontProductCatalog() {
  try {
    const catalogPath = path.resolve(__dirname, "../../js/products.js");
    const catalogSource = fs.readFileSync(catalogPath, "utf8");
    const catalogMatch = catalogSource.match(/const\s+products\s*=\s*(\[[\s\S]*?\])\s*;/);
    if (!catalogMatch) {
      return [];
    }

    const parseProducts = new Function(`return ${catalogMatch[1]};`);
    const products = parseProducts();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.warn("Failed to load storefront product catalog for email image mapping:", error.message);
    return [];
  }
}

const storefrontProductCatalog = loadStorefrontProductCatalog();

function resolveStorefrontProductImage(colorName, catalogProductId = null) {
  const normalizedCatalogProductId = normalizeCatalogValue(catalogProductId);

  if (!normalizedCatalogProductId) {
    return null;
  }

  const productMatch = storefrontProductCatalog.find((product) => {
    if (!product) {
      return false;
    }

    const possibleIds = [product.id, product.productId, product.sku]
      .map((value) => normalizeCatalogValue(value))
      .filter(Boolean);

    return possibleIds.includes(normalizedCatalogProductId);
  });

  if (!productMatch) {
    return null;
  }

  const normalizedColor = normalizeCatalogValue(colorName);
  const matchingVariant = Array.isArray(productMatch.colorways)
    ? productMatch.colorways.find((variant) => {
        const variantName = normalizeCatalogValue(variant && variant.name);
        return variantName === normalizedColor;
      })
    : null;

  if (!matchingVariant || !Array.isArray(matchingVariant.images) || !matchingVariant.images.length) {
    return null;
  }

  const imageUrl = matchingVariant.images
    .map((value) => String(value || "").trim())
    .find((value) => value && (value.startsWith("images/") || value.startsWith("http")));

  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `https://safirevintage.com/${imageUrl.replace(/^\/+/, "")}`;
}

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
    return "<tr><td colspan='6' style='padding: 18px 12px; color: #666; text-align: center;'>No items found.</td></tr>";
  }

  return lineItems.map((item) => {
    const quantity = Number(item.quantity || 1);
    const unitAmount = Number(item.unitAmount || 0);
    const totalAmount = Number(item.totalAmount || unitAmount * quantity);
    const price = formatCurrency(unitAmount, item.currency || "USD");
    const total = formatCurrency(totalAmount, item.currency || "USD");
    const size = String(item.size || "N/A").trim() || "N/A";
    const color = String(item.color || "N/A").trim() || "N/A";
    const productName = String(item.productName || "Unknown item").replace(/</g, "&lt;");
    const productImage = String(item.imageUrl || "").trim();
    const productCellHtml = productImage
      ? `
        <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
          <img src="${productImage}" alt="${productName}" style="width: 96px; height: 96px; object-fit: cover; border-radius: 10px; border: 1px solid #e8e3d8; background: #f5f2ee; display: block;" />
          <div style="font-weight: 600; color: #111111; line-height: 1.4;">${productName}</div>
        </div>
      `
      : `<div style="font-weight: 600; color: #111111; line-height: 1.4;">${productName}</div>`;

    return `
      <tr>
        <td style="padding: 14px 10px; border-bottom: 1px solid #ebebeb; vertical-align: top; color: #111111;">${productCellHtml}</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #ebebeb; text-align: center; color: #333333;">${quantity}</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #ebebeb; text-align: right; color: #333333;">${price}</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #ebebeb; color: #333333;">${size}</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #ebebeb; color: #333333;">${color}</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #ebebeb; text-align: right; font-weight: 700; color: #111111;">${total}</td>
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

  const customerName = order.shipping?.name || "Customer";
  const customerEmail = order.customerEmail || "N/A";
  const phone = order.phone || "N/A";
  const orderId = order.sessionId || "N/A";
  const addressLine = [
    order.shipping?.line1,
    order.shipping?.line2,
    order.shipping?.city,
    order.shipping?.state,
    order.shipping?.postal_code,
    order.shipping?.country
  ].filter(Boolean).join(", ");

  const itemsSummary = buildLineItemSummary(order.lineItems || []);
  const shippingAddressHtml = [
    `<div style="font-size: 14px; line-height: 1.7; color: #1f1f1f;">${String(customerName).replace(/</g, "&lt;")}</div>`,
    order.shipping?.line1 ? `<div style="font-size: 14px; line-height: 1.7; color: #1f1f1f;">${String(order.shipping.line1).replace(/</g, "&lt;")}</div>` : "",
    order.shipping?.line2 ? `<div style="font-size: 14px; line-height: 1.7; color: #1f1f1f;">${String(order.shipping.line2).replace(/</g, "&lt;")}</div>` : "",
    order.shipping?.city || order.shipping?.state || order.shipping?.postal_code || order.shipping?.country
      ? `<div style="font-size: 14px; line-height: 1.7; color: #1f1f1f;">${[
          order.shipping?.city,
          order.shipping?.state,
          order.shipping?.postal_code
        ].filter(Boolean).join(", ")}${order.shipping?.country ? `, ${String(order.shipping.country).replace(/</g, "&lt;")}` : ""}</div>`
      : "",
    order.shipping?.country ? `<div style="font-size: 14px; line-height: 1.7; color: #1f1f1f;">${String(order.shipping.country).replace(/</g, "&lt;")}</div>` : ""
  ].filter(Boolean).join("");

  const text = [
    "New Safire Order",
    `Order ID: ${orderId}`,
    `Date: ${orderDate}`,
    `Amount: ${amount}`,
    `Customer: ${customerName}`,
    `Email: ${customerEmail}`,
    `Phone: ${phone}`,
    `Items: ${itemsSummary || "N/A"}`,
    `Shipping Address: ${addressLine || "N/A"}`
  ].join("\n");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Safire Order</title>
        <style>
          @media only screen and (max-width: 620px) {
            .Safire-email-shell { width: 100% !important; }
            .Safire-email-body { padding: 24px 18px !important; }
            .Safire-email-grid { display: block !important; }
            .Safire-email-metrics { display: block !important; }
            .Safire-email-metric { display: block !important; width: 100% !important; margin-bottom: 10px !important; }
            .Safire-email-table th, .Safire-email-table td { font-size: 12px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #f3efe8; font-family: Arial, Helvetica, sans-serif; color: #111111;">
        <div class="Safire-email-shell" style="max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e1d5;">
          <div style="background: #0f0f0f; padding: 26px 32px 18px; text-align: center;">
            <div style="font-size: 28px; letter-spacing: 0.3em; font-weight: 700; color: #ffffff; line-height: 1.2;">SAFIRE</div>
            <div style="font-size: 10px; letter-spacing: 0.22em; color: #d3b87a; text-transform: uppercase; margin-top: 8px;">Vintage Streetwear</div>
          </div>

          <div class="Safire-email-body" style="padding: 34px 32px 28px;">
            <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #b79d64; font-weight: 700; margin-bottom: 10px;">Fulfillment alert</div>
            <h1 style="margin: 0 0 20px; font-size: 34px; line-height: 1.1; color: #111111; letter-spacing: -0.03em;">New Safire Order</h1>

            <div class="Safire-email-grid" style="display: table; width: 100%; border-collapse: separate; border-spacing: 0 12px; margin-bottom: 22px;">
              <div style="display: table-row;">
                <div class="Safire-email-metric" style="display: table-cell; width: 50%; background: #f7f5f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Order ID</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${orderId}</div>
                </div>
                <div class="Safire-email-metric" style="display: table-cell; width: 50%; background: #f7f5f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Date</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${orderDate}</div>
                </div>
              </div>
              <div style="display: table-row;">
                <div class="Safire-email-metric" style="display: table-cell; width: 50%; background: #f7f5f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Amount</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${amount}</div>
                </div>
                <div class="Safire-email-metric" style="display: table-cell; width: 50%; background: #f7f5f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Customer</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${String(customerName).replace(/</g, "&lt;")}</div>
                </div>
              </div>
            </div>

            <div style="background: #111111; border-radius: 14px; padding: 18px 20px; margin-bottom: 22px; color: #ffffff;">
              <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #d2b984; margin-bottom: 10px;">Customer details</div>
              <div style="font-size: 14px; line-height: 1.8;">
                <div><strong>Email:</strong> ${String(customerEmail).replace(/</g, "&lt;")}</div>
                <div><strong>Phone:</strong> ${String(phone).replace(/</g, "&lt;")}</div>
              </div>
            </div>

            <div style="margin-bottom: 10px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #b79d64; font-weight: 700;">Items</div>
            <table class="Safire-email-table" role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #e8e3d8; border-radius: 12px; overflow: hidden;">
              <thead>
                <tr style="background: #f6f3ee; text-align: left;">
                  <th style="padding: 12px 10px; border-bottom: 1px solid #e8e3d8; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6252;">Product</th>
                  <th style="padding: 12px 10px; border-bottom: 1px solid #e8e3d8; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6252; text-align: center;">Qty</th>
                  <th style="padding: 12px 10px; border-bottom: 1px solid #e8e3d8; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6252; text-align: right;">Price</th>
                  <th style="padding: 12px 10px; border-bottom: 1px solid #e8e3d8; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6252;">Size</th>
                  <th style="padding: 12px 10px; border-bottom: 1px solid #e8e3d8; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6252;">Color</th>
                  <th style="padding: 12px 10px; border-bottom: 1px solid #e8e3d8; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6252; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${buildOrderRowHtml(order.lineItems || [])}
              </tbody>
            </table>

            <div style="margin-top: 24px; background: #f8f6f2; border: 1px solid #e4ddcf; border-radius: 12px; padding: 18px 20px;">
              <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #b79d64; font-weight: 700; margin-bottom: 10px;">Shipping</div>
              <div style="font-size: 14px; line-height: 1.8; color: #1d1d1d;">${shippingAddressHtml || "N/A"}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return { text, html };
}

function buildCustomerProductCardsHtml(lineItems) {
  if (!lineItems.length) {
    return '<div style="padding: 18px 12px; color: #666; text-align: center;">No items found.</div>';
  }

  return lineItems.map((item) => {
    const quantity = Number(item.quantity || 1);
    const unitAmount = Number(item.unitAmount || 0);
    const totalAmount = Number(item.totalAmount || unitAmount * quantity);
    const price = formatCurrency(unitAmount, item.currency || "USD");
    const total = formatCurrency(totalAmount, item.currency || "USD");
    const size = String(item.size || "N/A").trim() || "N/A";
    const color = String(item.color || "N/A").trim() || "N/A";
    const productName = String(item.productName || "Unknown item").replace(/</g, "&lt;");
    const productImage = String(item.imageUrl || "").trim();
    const productImageMarkup = productImage
      ? `<img src="${productImage}" alt="${productName}" style="width: 96px; height: 96px; object-fit: cover; border-radius: 10px; border: 1px solid #e8e3d8; background: #f5f2ee; display: block; flex-shrink: 0;" />`
      : `<div style="width: 96px; height: 96px; border-radius: 10px; border: 1px solid #e8e3d8; background: #efeae0; display: flex; align-items: center; justify-content: center; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; flex-shrink: 0;">Item</div>`;

    return `
      <div style="display: flex; align-items: center; gap: 14px; background: #f8f6f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 12px; margin-bottom: 12px;">
        ${productImageMarkup}
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 15px; font-weight: 700; color: #111111; line-height: 1.4; margin-bottom: 8px;">${productName}</div>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 12px; font-size: 12px; color: #333333;">
            <div><span style="display: inline-block; min-width: 38px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-right: 6px;">Size</span>${size}</div>
            <div><span style="display: inline-block; min-width: 38px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-right: 6px;">Qty</span>${quantity}</div>
            <div><span style="display: inline-block; min-width: 38px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-right: 6px;">Color</span>${color}</div>
            <div><span style="display: inline-block; min-width: 38px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-right: 6px;">Price</span>${price}</div>
          </div>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #111111; white-space: nowrap; margin-left: 10px;">${total}</div>
      </div>
    `;
  }).join("");
}

function buildCustomerConfirmation(order) {
  const amount = order.amountTotal != null
    ? formatCurrency(order.amountTotal, order.currency || "USD")
    : "Unknown";

  const orderDate = order.completedAt
    ? new Date(order.completedAt * 1000).toLocaleString("en-US", { timeZone: "America/New_York" })
    : new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  const customerName = order.shipping?.name || "Customer";
  const orderId = order.sessionId || "N/A";
  const shippingText = [
    order.shipping?.name,
    order.shipping?.line1,
    [order.shipping?.city, order.shipping?.state, order.shipping?.postal_code].filter(Boolean).join(", "),
    order.shipping?.country
  ].filter(Boolean).join("<br>");

  const text = [
    "Thank you for shopping with Safire.",
    `Order ID: ${orderId}`,
    `Date: ${orderDate}`,
    `Amount: ${amount}`,
    `Shipping: ${shippingText || "N/A"}`,
    `Customer: ${customerName}`
  ].join("\n");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Safire Order Confirmation</title>
        <style>
          @media only screen and (max-width: 620px) {
            .Safire-customer-shell { width: 100% !important; }
            .Safire-customer-body { padding: 24px 18px !important; }
            .Safire-customer-summary { display: block !important; }
            .Safire-customer-summary-cell { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
            .Safire-customer-table th, .Safire-customer-table td { font-size: 12px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #f3efe8; font-family: Arial, Helvetica, sans-serif; color: #111111;">
        <div class="Safire-customer-shell" style="max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e1d5;">
          <div style="background: #0f0f0f; padding: 26px 32px 18px; text-align: center;">
            <div style="font-size: 28px; letter-spacing: 0.3em; font-weight: 700; color: #ffffff; line-height: 1.2;">SAFIRE</div>
            <div style="font-size: 10px; letter-spacing: 0.22em; color: #d3b87a; text-transform: uppercase; margin-top: 8px;">Vintage Streetwear</div>
          </div>

          <div class="Safire-customer-body" style="padding: 34px 32px 28px;">
            <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #b79d64; font-weight: 700; margin-bottom: 10px;">Order confirmed</div>
            <h1 style="margin: 0 0 18px; font-size: 38px; line-height: 1.08; color: #111111; letter-spacing: -0.03em;">Order Confirmed</h1>
            <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #4c4a45;">Thank you for shopping with Safire. Your order is now being prepared with care.</p>

            <div class="Safire-customer-summary" style="display: table; width: 100%; border-collapse: separate; border-spacing: 0 12px; margin-bottom: 22px;">
              <div style="display: table-row;">
                <div class="Safire-customer-summary-cell" style="display: table-cell; width: 50%; background: #f8f6f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Order ID</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${orderId}</div>
                </div>
                <div class="Safire-customer-summary-cell" style="display: table-cell; width: 50%; background: #f8f6f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Order Date</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${orderDate}</div>
                </div>
              </div>
              <div style="display: table-row;">
                <div class="Safire-customer-summary-cell" style="display: table-cell; width: 50%; background: #111111; border: 1px solid #111111; border-radius: 12px; padding: 14px 16px; color: #ffffff;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #d5b774; margin-bottom: 6px;">Total</div>
                  <div style="font-size: 24px; font-weight: 700; line-height: 1.2;">${amount}</div>
                </div>
                <div class="Safire-customer-summary-cell" style="display: table-cell; width: 50%; background: #f8f6f1; border: 1px solid #e4ddcf; border-radius: 12px; padding: 14px 16px;">
                  <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #867765; margin-bottom: 6px;">Customer</div>
                  <div style="font-size: 15px; font-weight: 700; color: #111111;">${String(customerName).replace(/</g, "&lt;")}</div>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 10px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #b79d64; font-weight: 700;">Order summary</div>
            <div style="display: block; width: 100%;">
              ${buildCustomerProductCardsHtml(order.lineItems || [])}
            </div>

            <div style="margin-top: 24px; background: #f8f6f2; border: 1px solid #e4ddcf; border-radius: 12px; padding: 18px 20px;">
              <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #b79d64; font-weight: 700; margin-bottom: 10px;">Shipping information</div>
              <div style="font-size: 14px; line-height: 1.8; color: #1d1d1d;">${shippingText || "N/A"}</div>
            </div>

            <div style="margin-top: 24px; text-align: center;">
              <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.7; color: #4a4742;">Thank you for shopping with Safire.</p>
              <div style="display: inline-block; background: #111111; border-radius: 999px; padding: 12px 22px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: #ffffff;">
                <a href="https://safirevintage.com" style="color: #ffffff; text-decoration: none;">Visit Safire</a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
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
  const catalogProductId = String(productMetadata.product_id || productMetadata.productId || productMetadata.id || "").trim();
  const productImageUrl = resolveStorefrontProductImage(color, catalogProductId);
  const unitAmount = Number(priceData.unit_amount || lineItem?.amount_total || 0);
  const quantity = Number(lineItem?.quantity || 1);

  return {
    productName,
    quantity,
    unitAmount,
    totalAmount: Number(lineItem?.amount_total || unitAmount * quantity),
    currency: String(priceData.currency || "USD").toUpperCase(),
    size,
    color,
    imageUrl: productImageUrl || null
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

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (liveSignatureError) {
      if (!process.env.STRIPE_TEST_WEBHOOK_SECRET) {
        throw liveSignatureError;
      }

      try {
        stripeEvent = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          process.env.STRIPE_TEST_WEBHOOK_SECRET
        );
      } catch (_testSignatureError) {
        throw liveSignatureError;
      }
    }

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
