function normalizeCartValue(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeCartColor(value) {
    return normalizeCartValue(value).split('/')[0].trim().replace(/\s+/g, '-');
}

function getCart() {
    try {
        const parsed = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(parsed)) return [];

        return parsed.map((item) => ({
            productId: normalizeCartValue(item.productId),
            name: item.name,
            color: normalizeCartColor(item.color),
            size: normalizeCartValue(item.size),
            price: Number(item.price) || 0,
            quantity: Math.max(1, Number(item.quantity) || 1)
        }));
    } catch (_error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
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

function appendQuantityParam(url, quantity) {
    const qty = Math.max(1, Number(quantity) || 1);
    if (qty <= 1) return url;
    return `${url}${url.includes('?') ? '&' : '?'}quantity=${qty}`;
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const checkoutPlan = cart.map((item) => ({
        item,
        quantity: Math.max(1, Number(item.quantity) || 1),
        stripeUrl: getStripeUrlForCartItem(item)
    }));

    const missingLinks = checkoutPlan.filter((entry) => !entry.stripeUrl);
    if (missingLinks.length > 0) {
        const missingNames = missingLinks
            .map((entry) => `${entry.item.name} (${String(entry.item.size || '').toUpperCase()}, ${entry.item.color})`)
            .join('\n');
        alert(`No Stripe link found for:\n${missingNames}`);
        return;
    }

    const cartTotal = cart.reduce((sum, item) => {
        const quantity = Math.max(1, Number(item.quantity) || 1);
        return sum + ((Number(item.price) || 0) * quantity);
    }, 0);

    if (checkoutPlan.length === 1) {
        const single = checkoutPlan[0];
        window.location.href = appendQuantityParam(single.stripeUrl, single.quantity);
        return;
    }

    const shouldOpenAll = window.confirm(
        `Your total is $${cartTotal.toFixed(2)}. This cart has ${checkoutPlan.length} different items, so Stripe checkout will open one tab per item variant. Continue?`
    );

    if (!shouldOpenAll) return;

    checkoutPlan.forEach((entry) => {
        const urlWithQuantity = appendQuantityParam(entry.stripeUrl, entry.quantity);
        window.open(urlWithQuantity, '_blank');
    });
}
