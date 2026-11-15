function normalizeCartValue(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeCartColor(value) {
    return normalizeCartValue(value).split('/')[0].trim().replace(/\s+/g, '-');
}

function isBlackFridaySaleActive(now = new Date()) {
    return false;
}

function getSalePrice(value) {
    return Number(value) || 0;
}

function formatCartColorLabel(value) {
    const normalized = normalizeCartColor(value);
    if (!normalized || normalized === 'default') return 'Default';

    return normalized
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function sanitizeCheckoutString(value, maxLength) {
    const normalized = String(value || '')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!normalized) return '';
    if (!maxLength || normalized.length <= maxLength) return normalized;
    return normalized.slice(0, maxLength).trim();
}

function isValidStripePriceId(value) {
    return /^price_[A-Za-z0-9]+$/.test(String(value || '').trim());
}

function getCart() {
    try {
        const parsed = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(parsed)) return [];

        const sanitizedCart = parsed
            .map((item) => {
                const normalizedProductId = normalizeCartValue(item.productId || item.id);
                const matchedProduct = getProductById(normalizedProductId);
                const normalizedPrice = getCanonicalProductPrice(normalizedProductId) || (matchedProduct ? (Number(matchedProduct.price) || 0) : (Number(item.price) || 0));

                const selectedImage = String(item.image || item.images?.[0] || '').trim();
                const resolvedImage = getColorwayImage(matchedProduct, item.color) || selectedImage || matchedProduct?.images?.[0] || matchedProduct?.colorways?.[0]?.images?.[0] || '';

                return {
                    productId: normalizedProductId,
                    name: item.name,
                    color: normalizeCartColor(item.color),
                    size: normalizeCartValue(item.size),
                    price: normalizedPrice,
                    quantity: Math.max(1, Number(item.quantity) || 1),
                    image: resolvedImage
                };
            })
            .filter((item) => getProductById(item.productId));

        const pricesUpdated = sanitizedCart.some((item) => {
            const originalItem = parsed.find((entry) => {
                const entryId = normalizeCartValue(entry.productId || entry.id || '');
                return entryId && entryId === item.productId
                    && String(entry.name || '').trim() === String(item.name || '').trim();
            });
            const originalPrice = Number(originalItem && originalItem.price !== undefined ? originalItem.price : item.price) || 0;
            const currentPrice = Number(item.price) || 0;
            return originalPrice !== currentPrice;
        });

        if (sanitizedCart.length !== parsed.length || pricesUpdated) {
            saveCart(sanitizedCart);
        }

        return sanitizedCart;
    } catch (_error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getProductById(productId) {
    const normalizedProductId = normalizeCartValue(productId);
    if (!normalizedProductId) return null;

    const catalogLists = [];
    if (typeof products !== 'undefined' && Array.isArray(products)) catalogLists.push(products);
    if (typeof productsData !== 'undefined' && Array.isArray(productsData)) catalogLists.push(productsData);

    for (const list of catalogLists) {
        const match = list.find((entry) => {
            const productIds = [entry.id, entry.productId, entry.sku].filter((value) => value !== undefined && value !== null && value !== '');
            return productIds.some((value) => normalizeCartValue(value) === normalizedProductId);
        });
        if (match) return match;
    }

    return null;
}

function getCanonicalProductPrice(productId) {
    const explicit = {
        'safire-sweatpants': 50,
        'script-zip-hoodie': 60
    };

    const normalizedProductId = normalizeCartValue(productId);
    if (normalizedProductId && explicit[normalizedProductId] !== undefined) {
        return getSalePrice(explicit[normalizedProductId]);
    }

    const product = getProductById(productId);
    return product ? getSalePrice(Number(product.price) || 0) : 0;
}

function getColorwayImage(product, colorName) {
    if (!product) return '';

    const normalizedColor = normalizeCartColor(colorName || '');
    const colorwayMatch = product.colorways?.find((entry) => {
        const entryName = normalizeCartColor(entry.name || '');
        return entryName && entryName === normalizedColor;
    });

    if (colorwayMatch?.images?.[0]) return colorwayMatch.images[0];
    if (product.images?.[0]) return product.images[0];
    return '';
}

function getStripePriceId(productId) {
    if (typeof stripePrices !== 'object' || stripePrices === null) return null;

    const normalizedProductId = String(productId || '').toLowerCase().trim();
    const hyphenKey = normalizedProductId.replace(/\s+/g, '-').replace(/_/g, '-');
    const tshirtHyphenKey = hyphenKey.replace(/tshirt/g, 't-shirt');
    const tshirtCompactKey = hyphenKey.replace(/t-shirt/g, 'tshirt');

    const explicitPriceId = stripePrices[normalizedProductId]
        || stripePrices[hyphenKey]
        || stripePrices[tshirtHyphenKey]
        || stripePrices[tshirtCompactKey];
    if (explicitPriceId) return explicitPriceId;

    // All Socrates hoodie colors should share the black Socrates Stripe price.
    if (hyphenKey.endsWith('socrates-hoodie')) {
        return stripePrices['black-socrates-hoodie'] || null;
    }

    return null;
}

function updateCartSectionLabel(count) {
    const label = document.getElementById('cart-section-label');
    if (!label) return;
    const total = Number(count) || 0;
    label.textContent = `${total} ${total === 1 ? 'item' : 'items'} in your bag`;
}

function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach((element) => {
        element.textContent = totalCount;
    });
    updateCartSectionLabel(totalCount);
}

function addToCart(item) {
    const cart = getCart();
    const productMatch = getProductById(item.productId || item.id);
    const regularPrice = productMatch ? getSalePrice(Number(productMatch.price) || 0) : getSalePrice(Number(item.price) || 0);

    const normalizedItem = {
        productId: normalizeCartValue(item.productId),
        name: item.name,
        color: normalizeCartColor(item.color),
        size: normalizeCartValue(item.size),
        price: regularPrice,
        quantity: 1,
        image: getColorwayImage(productMatch, item.color) || String(item.image || item.images?.[0] || '').trim() || productMatch?.images?.[0] || productMatch?.colorways?.[0]?.images?.[0] || ''
    };

    const existingIndex = cart.findIndex((entry) => (
        normalizeCartValue(entry.productId) === normalizedItem.productId
        && normalizeCartColor(entry.color) === normalizedItem.color
        && normalizeCartValue(entry.size) === normalizedItem.size
    ));

    if (existingIndex >= 0) {
        cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 1) + 1;
    } else {
        cart.push(normalizedItem);
    }

    saveCart(cart);
    updateCartCount();
}

function removeCartItem(index) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;

    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function updateCartItemQuantity(index, delta) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;

    const nextQuantity = (Number(cart[index].quantity) || 1) + Number(delta || 0);
    if (nextQuantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = nextQuantity;
    }

    saveCart(cart);
    renderCart();
}


function getRecommendedProducts() {
    const cart = getCart();
    const cartIds = new Set(cart.map((item) => normalizeCartValue(item.productId)).filter(Boolean));
    const sourceProducts = Array.isArray(products) ? products : [];

    const pool = sourceProducts.filter((product) => {
        if (!product || !product.name) return false;
        if (cartIds.has(normalizeCartValue(product.id))) return false;
        if (product.soldOut) return false;
        return true;
    });

    const cartText = cart
        .map((item) => `${item.productId || ''} ${item.name || ''}`.toLowerCase())
        .join(' ');

    const categoryRules = [
        {
            match: /hoodie|crewneck|zip|quarter/i,
            priority: ['waffle-barrel', 'mesh-drawstring-shorts', 'classic-quarter-zip', 'safire-shores-crewneck', 'waffle-hoodie']
        },
        {
            match: /t-shirt|shirt|tee/i,
            priority: ['waffle-hoodie', 'classic-quarter-zip', 'safire-horizon-zip-hoodie', 'safire-shores-crewneck']
        },
        {
            match: /shorts|barrel|sweatpants|pants/i,
            priority: ['waffle-hoodie', 'safire-horizon-zip-hoodie', 'classic-quarter-zip', 'waffle-barrel']
        },
        {
            match: /beanie|hat|accessory/i,
            priority: ['waffle-hoodie', 'black-socrates-hoodie', 'classic-quarter-zip']
        }
    ];

    let preferredIds = [];
    for (const rule of categoryRules) {
        if (rule.match.test(cartText)) {
            preferredIds = rule.priority;
            break;
        }
    }

    const ordered = [...preferredIds]
        .map((id) => pool.find((product) => normalizeCartValue(product.id) === id))
        .filter(Boolean);

    for (const product of pool) {
        const productId = normalizeCartValue(product.id);
        const exists = ordered.some((entry) => normalizeCartValue(entry.id) === productId);
        if (!exists) ordered.push(product);
    }

    return ordered.slice(0, 2);
}

function renderFrequentlyBought() {
    const container = document.getElementById('frequently-bought-list');
    if (!container) return;

    const recommended = getRecommendedProducts();

    if (!recommended.length) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = recommended.map((product) => {
        const image = product.images?.[0]
            || product.colorways?.[0]?.images?.[0]
            || 'images/favicon-diamond.svg';
        const price = Number(product.price) || 0;

        return `
            <a class="frequently-bought-item" href="product.html?id=${encodeURIComponent(product.id)}">
                <div class="frequently-bought-media">
                    <img src="${image}" alt="${product.name}" />
                </div>
                <div class="frequently-bought-copy">
                    <span class="frequently-bought-name">${product.name}</span>
                    <strong>$${price.toFixed(0)}</strong>
                </div>
            </a>
        `;
    }).join('');
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    if (!cartItemsContainer || !cartTotalElement) return;

    const cart = getCart();
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <p class="cart-empty-label">0 items</p>
                <p class="cart-empty-text">Your bag is empty.</p>
                <a href="index.html" class="cart-empty-link">Continue shopping</a>
            </div>
        `;
        cartTotalElement.textContent = '$0';
        if (cartSubtotalElement) cartSubtotalElement.textContent = '$0';
        updateCartSectionLabel(0);
        updateCartCount();
        renderFrequentlyBought();
        return;
    }

    updateCartSectionLabel(cart.length);

    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const product = getProductById(item.productId);
        const colorLabel = formatCartColorLabel(item.color || product?.colorways?.[0]?.name || 'Default');
        const sizeLabel = String(item.size || '').toUpperCase() || 'ONE SIZE';
        const imageSrc = getColorwayImage(product, item.color)
            || item.image
            || product?.images?.[0]
            || 'images/favicon-diamond.svg';

        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const lineTotal = price * quantity;
        total += lineTotal;

        const row = document.createElement('article');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-row">
                <div class="cart-item-media">
                    <img src="${imageSrc}" alt="${item.name}" />
                </div>
                <div class="cart-item-copy">
                    <h3>${item.name}</h3>
                    <p class="cart-meta-value">${colorLabel} / ${sizeLabel}</p>
                    <p class="cart-item-price">$${lineTotal.toFixed(0)}</p>
                    <div class="cart-item-footer">
                        <div class="qty-picker" aria-label="Quantity selector">
                            <button type="button" class="qty-btn" onclick="updateCartItemQuantity(${index}, -1)" aria-label="Decrease quantity">−</button>
                            <span class="qty-value">${quantity}</span>
                            <button type="button" class="qty-btn" onclick="updateCartItemQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    if (cartSubtotalElement) cartSubtotalElement.textContent = `$${total.toFixed(0)}`;
    cartTotalElement.textContent = `$${total.toFixed(0)}`;
    updateCartCount();
    renderFrequentlyBought();
}

async function createStripeCheckoutSession(payload) {
    try {
        const isLocalCheckout = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const localCheckoutEndpoint = 'http://localhost:4242/.netlify/functions/create-checkout-session';
        const remoteCheckoutEndpoint = 'https://safire1.netlify.app/.netlify/functions/create-checkout-session';
        const candidateEndpoints = isLocalCheckout
            ? [localCheckoutEndpoint, remoteCheckoutEndpoint]
            : [remoteCheckoutEndpoint, localCheckoutEndpoint];

        let lastError = null;

        for (const checkoutEndpoint of candidateEndpoints) {
            try {
                const response = await fetch(checkoutEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const rawResponseText = await response.text();
                const contentType = response.headers.get('content-type') || '';
                console.log('checkout status:', response.status, 'url:', checkoutEndpoint, 'content-type:', contentType);
                console.log(rawResponseText);

                let data;
                try {
                    data = JSON.parse(rawResponseText);
                } catch (_parseError) {
                    throw new Error(`Checkout backend returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType || 'unknown'}. Body preview: ${String(rawResponseText).slice(0, 200)}`);
                }

                if (!response.ok || (!data.url && !data.sessionId)) {
                    throw new Error(data.error || 'Failed to create checkout session.');
                }

                if (data.url) {
                    window.location = data.url;
                    return;
                }

                if (data.sessionId) {
                    throw new Error('Checkout session created but redirect URL was missing.');
                }
            } catch (error) {
                lastError = error;
                console.warn(`Checkout fetch failed for ${checkoutEndpoint}:`, error.message || error);
                continue;
            }
        }

        throw lastError || new Error('Checkout failed. Please try again.');
    } catch (error) {
        alert(error.message || 'Checkout failed. Please try again.');
    }
}

async function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const checkoutItems = cart.map((item) => {
        const productId = normalizeCartValue(item.productId);
        const matchedProduct = getProductById(productId);
        const selectedName = sanitizeCheckoutString(item.name || matchedProduct?.name || productId, 120);
        const selectedSize = normalizeCartValue(item.size || 'default');
        const selectedColor = normalizeCartColor(item.color || 'default');
        const selectedSizeLabel = sanitizeCheckoutString(selectedSize.toUpperCase(), 40);
        const selectedColorLabel = sanitizeCheckoutString(formatCartColorLabel(selectedColor), 80);
        const selectedPriceId = getStripePriceId(productId);

        return {
            productId,
            name: selectedName,
            priceId: selectedPriceId,
            quantity: Math.max(1, Number(item.quantity) || 1),
            size: selectedSize,
            color: selectedColor,
            sizeLabel: selectedSizeLabel,
            colorLabel: selectedColorLabel
        };
    });

    const missingPriceIds = checkoutItems.filter((item) => !item.priceId || item.priceId === 'price_xxxxx');
    if (missingPriceIds.length > 0) {
        const missingNames = missingPriceIds.map((item) => item.productId).join(', ');
        alert(`Missing Stripe price ID for: ${missingNames}`);
        return;
    }

    const invalidPriceIds = checkoutItems.filter((item) => !isValidStripePriceId(item.priceId));
    if (invalidPriceIds.length > 0) {
        const invalidNames = invalidPriceIds.map((item) => `${item.productId} (${item.priceId})`).join(', ');
        alert(`Invalid Stripe price ID format for: ${invalidNames}`);
        return;
    }

    const payload = checkoutItems.length === 1
        ? {
            productId: checkoutItems[0].productId,
            name: checkoutItems[0].name,
            priceId: checkoutItems[0].priceId,
            quantity: checkoutItems[0].quantity,
            size: checkoutItems[0].size,
            color: checkoutItems[0].color,
            sizeLabel: checkoutItems[0].sizeLabel,
            colorLabel: checkoutItems[0].colorLabel
        }
        : { items: checkoutItems };

    await createStripeCheckoutSession(payload);
}

async function directCheckoutProduct(item) {
    const productId = normalizeCartValue(item.productId || item.id);
    const product = getProductById(productId);
    const selectedSize = normalizeCartValue(item.size || 'default');
    const selectedColor = normalizeCartColor(item.color || 'default');
    const selectedPriceId = getStripePriceId(productId);

    if (!productId) {
        alert('Product not found.');
        return;
    }

    if (!selectedPriceId || selectedPriceId === 'price_xxxxx') {
        alert(`Missing Stripe price ID for: ${productId}`);
        return;
    }

    if (!isValidStripePriceId(selectedPriceId)) {
        alert(`Invalid Stripe price ID format for: ${productId} (${selectedPriceId})`);
        return;
    }

    const payload = {
        productId,
        name: sanitizeCheckoutString(item.name || product?.name || productId, 120),
        priceId: selectedPriceId,
        quantity: Math.max(1, Number(item.quantity) || 1),
        size: selectedSize,
        color: selectedColor,
        sizeLabel: sanitizeCheckoutString(selectedSize.toUpperCase(), 40),
        colorLabel: sanitizeCheckoutString(formatCartColorLabel(selectedColor), 80)
    };

    await createStripeCheckoutSession(payload);
}

function handleCheckoutStatus() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('checkout');
    const statusElement = document.getElementById('cart-status');

    if (!statusElement) return;

    statusElement.style.display = 'none';
    statusElement.textContent = '';

    if (status === 'success') {
        saveCart([]);
        renderCart();
        statusElement.style.display = 'block';
        statusElement.style.background = '#eaf7ef';
        statusElement.style.color = '#1e6b3a';
        statusElement.style.border = '1px solid #b7e4c7';
        statusElement.textContent = 'Payment successful. Thank you for your order!';
    }

    if (status === 'cancel') {
        statusElement.style.display = 'block';
        statusElement.style.background = '#fff6e5';
        statusElement.style.color = '#8a5a00';
        statusElement.style.border = '1px solid #ffe0a3';
        statusElement.textContent = 'Checkout was canceled. Your cart is still saved.';
    }
}
