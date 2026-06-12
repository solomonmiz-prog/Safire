(function () {
    function safeArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function inferCategory(product) {
        const text = `${product.name || ""} ${product.id || ""} ${product.description || ""}`.toLowerCase();
        if (text.includes("bag") || text.includes("hat") || text.includes("sock") || text.includes("accessor")) {
            return "accessories";
        }
        if (text.includes("cropped") || text.includes("women")) {
            return "women";
        }
        return "men";
    }

    function getPrimaryImage(product) {
        if (safeArray(product.images).length > 0) {
            return product.images[0];
        }
        return "images/logo.png";
    }

    function updateCartCount() {
        const countEl = document.getElementById("cart-count");
        if (!countEl) return;

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart") || "[]");
        } catch (_err) {
            cart = [];
        }

        const totalItems = safeArray(cart).reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        countEl.textContent = String(totalItems);
    }

    function initHamburgerMenu() {
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener("click", function () {
            navMenu.classList.toggle("open");
            hamburger.classList.toggle("open");
        });
    }

    function initProductsPage() {
        const grid = document.getElementById("products-grid");
        if (!grid) return;

        const categoryInputs = Array.from(document.querySelectorAll(".category-filter"));
        const priceRange = document.getElementById("price-range");
        const priceValue = document.getElementById("price-value");

        const allProducts = typeof products !== "undefined" ? safeArray(products) : [];

        function selectedCategories() {
            return categoryInputs.filter((input) => input.checked).map((input) => input.value.toLowerCase());
        }

        function productMatchesCategory(product, categories) {
            if (categories.length === 0) return true;
            const category = inferCategory(product);
            return categories.includes(category);
        }

        function renderCards(productList) {
            if (productList.length === 0) {
                grid.innerHTML = "<p>No products match your current filters.</p>";
                return;
            }

            grid.innerHTML = productList
                .map((product) => {
                    const image = getPrimaryImage(product);
                    const price = Number(product.price) || 0;
                    return `
                        <article class="product-card" onclick="window.location.href='product.html?id=${encodeURIComponent(product.id)}'" style="cursor:pointer;">
                            <img src="${image}" alt="${product.name}" loading="lazy" style="width:100%;aspect-ratio:1/1;object-fit:cover;">
                            <div style="padding:12px 0;">
                                <h3 style="margin:0 0 6px;">${product.name}</h3>
                                <p style="margin:0;color:#666;">$${price.toFixed(0)}</p>
                            </div>
                        </article>
                    `;
                })
                .join("");
        }

        function applyFilters() {
            const maxPrice = priceRange ? Number(priceRange.value) || Infinity : Infinity;
            const categories = selectedCategories();

            const filtered = allProducts.filter((product) => {
                const priceOk = (Number(product.price) || 0) <= maxPrice;
                const categoryOk = productMatchesCategory(product, categories);
                return priceOk && categoryOk;
            });

            renderCards(filtered);
        }

        if (priceRange && priceValue) {
            priceValue.textContent = priceRange.value;
            priceRange.addEventListener("input", function () {
                priceValue.textContent = this.value;
                applyFilters();
            });
        }

        categoryInputs.forEach((input) => input.addEventListener("change", applyFilters));

        window.resetFilters = function resetFilters() {
            categoryInputs.forEach((input) => {
                input.checked = false;
            });

            if (priceRange && priceValue) {
                priceRange.value = priceRange.max;
                priceValue.textContent = priceRange.max;
            }

            applyFilters();
        };

        applyFilters();
    }

    document.addEventListener("DOMContentLoaded", function () {
        initHamburgerMenu();
        initProductsPage();
        updateCartCount();
    });
})();
