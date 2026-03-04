function normalizeCartValue(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeCartColor(value) {
    return normalizeCartValue(value).split('/')[0].trim().replace(/\s+/g, '-');
}

function getCart() {
    try {
        const parsed = JSON.parse(localStorage.getItem('cart') || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach((element) => {
        element.textContent = cart.length;
    });
}

function addToCart(item) {
    const cart = getCart();
    cart.push({
        productId: normalizeCartValue(item.productId),
        name: item.name,
        color: normalizeCartColor(item.color),
        size: normalizeCartValue(item.size),
        price: Number(item.price)
    });
    saveCart(cart);
    updateCartCount();
}

function getStripeUrlForCartItem(item) {
    if (!item || !item.productId) return null;

    const productId = normalizeCartValue(item.productId);
    const color = normalizeCartColor(item.color || 'default');
    const size = normalizeCartValue(item.size);
    const key = `${color}-${size}`;
    const fullKey = `${productId}-${key}`;

    if (typeof stripeVariantCheckoutLinks === 'object' && stripeVariantCheckoutLinks !== null) {
        if (stripeVariantCheckoutLinks[fullKey]) {
            return stripeVariantCheckoutLinks[fullKey];
        }
    }

    if (typeof products !== 'undefined' && Array.isArray(products)) {
        const product = products.find((entry) => normalizeCartValue(entry.id) === productId);
        if (!product || !product.stripeLinks) return null;

        const normalizedStripeLinks = {};
        Object.keys(product.stripeLinks).forEach((stripeKey) => {
            normalizedStripeLinks[normalizeCartValue(stripeKey)] = product.stripeLinks[stripeKey];
        });

        return normalizedStripeLinks[key] || null;
    }

    return null;
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

    cart.forEach((item) => {
        const price = Number(item.price) || 0;
        total += price;

        const row = document.createElement('article');
        row.className = 'cart-item';
        row.innerHTML = `
            <h3>${item.name}</h3>
            <p>Color: ${item.color}</p>
            <p>Size: ${String(item.size || '').toUpperCase()}</p>
            <p class="cart-item-price">$${price.toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const firstItem = cart[0];
    const stripeUrl = getStripeUrlForCartItem(firstItem);

    if (!stripeUrl) {
        alert('No Stripe link found for this cart item variant.');
        return;
    }

    window.location.href = stripeUrl;
}
