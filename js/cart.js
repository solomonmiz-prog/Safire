function normalizeCartValue(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeCartColor(value) {
    return normalizeCartValue(value).split('/')[0].trim().replace(/\s+/g, '-');
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

function getCart() {
    try {
        const parsed = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(parsed)) return [];

        const sanitizedCart = parsed
            .map((item) => ({
                productId: normalizeCartValue(item.productId),
                name: item.name,
                color: normalizeCartColor(item.color),
                size: normalizeCartValue(item.size),
                price: Number(item.price) || 0,
                quantity: Math.max(1, Number(item.quantity) || 1)
            }))
            .filter((item) => getProductById(item.productId));

        if (sanitizedCart.length !== parsed.length) {
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
    if (typeof products === 'undefined' || !Array.isArray(products)) return null;
    const normalizedProductId = normalizeCartValue(productId);
    return products.find((entry) => normalizeCartValue(entry.id) === normalizedProductId) || null;
}

function getStripePriceId(productId) {
    if (typeof stripePrices !== 'object' || stripePrices === null) return null;
    return stripePrices[normalizeCartValue(productId)] || null;
}

function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach((element) => {
        element.textContent = totalCount;
    });
}

function addToCart(item) {
    const cart = getCart();

    const normalizedItem = {
        productId: normalizeCartValue(item.productId),
        name: item.name,
        color: normalizeCartColor(item.color),
        size: normalizeCartValue(item.size),
        price: Number(item.price) || 0,
        quantity: 1
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


function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartItemsContainer || !cartTotalElement) return;

    const cart = getCart();
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        cartTotalElement.textContent = '$0.00';
        updateCartCount();
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const lineTotal = price * quantity;
        total += lineTotal;

        const row = document.createElement('article');
        row.className = 'cart-item';
        row.innerHTML = `
            <h3>${item.name}</h3>
            <p>Color: ${item.color}</p>
            <p>Size: ${String(item.size || '').toUpperCase()}</p>
            <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
                <button type="button" onclick="updateCartItemQuantity(${index}, -1)" aria-label="Decrease quantity">−</button>
                <strong>${quantity}</strong>
                <button type="button" onclick="updateCartItemQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
                <button type="button" onclick="removeCartItem(${index})" style="margin-left:auto;">Remove</button>
            </div>
            <p class="cart-item-price">$${lineTotal.toFixed(2)} <span style="color:#666;font-weight:400;">($${price.toFixed(2)} each)</span></p>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

async function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const checkoutItems = cart.map((item) => {
        const productId = normalizeCartValue(item.productId);
        const selectedSize = normalizeCartValue(item.size || 'default');
        const selectedColor = normalizeCartColor(item.color || 'default');

        return {
            productId,
            priceId: getStripePriceId(productId),
            quantity: Math.max(1, Number(item.quantity) || 1),
            size: selectedSize,
            color: selectedColor
        };
    });

    const missingPriceIds = checkoutItems.filter((item) => !item.priceId || item.priceId === 'price_xxxxx');
    if (missingPriceIds.length > 0) {
        const missingNames = missingPriceIds.map((item) => item.productId).join(', ');
        alert(`Missing Stripe price ID for: ${missingNames}`);
        return;
    }

    const payload = checkoutItems.length === 1
        ? checkoutItems[0]
        : { items: checkoutItems };

    try {
        const response = await fetch('https://safire1.netlify.app/.netlify/functions/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok || !data.url) {
            throw new Error(data.error || 'Failed to create checkout session.');
        }

        window.location = data.url;
    } catch (error) {
        alert(error.message || 'Checkout failed. Please try again.');
    }
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
