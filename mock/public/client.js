(function () {
  const apiBase = '/api';
  const cartKey = 'mock-cart';
  const shippingKey = 'mock-shipping';

  const appState = {
    products: [],
    cart: readCart(),
    shipping: readShipping(),
  };

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(cartKey) || '[]');
    } catch {
      return [];
    }
  }

  function writeCart(cart) {
    appState.cart = cart;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartBadge();
  }

  function readShipping() {
    try {
      return JSON.parse(localStorage.getItem(shippingKey) || 'null');
    } catch {
      return null;
    }
  }

  function writeShipping(shipping) {
    appState.shipping = shipping;
    localStorage.setItem(shippingKey, JSON.stringify(shipping));
  }

  function cartCount() {
    return appState.cart.length;
  }

  function updateCartBadge() {
    const badge = document.querySelector('.shopping_cart_badge');
    if (!badge) {
      return;
    }

    if (cartCount() === 0) {
      badge.hidden = true;
      badge.textContent = '';
      return;
    }

    badge.hidden = false;
    badge.textContent = String(cartCount());
  }

  function productInCart(productId) {
    return appState.cart.includes(productId);
  }

  function setCartButtonState(button, productId) {
    if (productInCart(productId)) {
      button.textContent = 'Remove';
      button.dataset.test = `remove-${productId}`;
      button.dataset.action = 'remove';
      return;
    }

    button.textContent = 'Add to cart';
    button.dataset.test = `add-to-cart-${productId}`;
    button.dataset.action = 'add';
  }

  function renderProductList() {
    const container = document.querySelector('[data-role="product-list"]');
    const sortSelect = document.querySelector('[data-test="product-sort-container"]');
    if (!container || !sortSelect) {
      return;
    }

    const sortMode = sortSelect.value;
    const products = [...appState.products].sort((left, right) => {
      if (sortMode === 'za') {
        return right.name.localeCompare(left.name);
      }

      if (sortMode === 'lohi') {
        return left.price - right.price;
      }

      if (sortMode === 'hilo') {
        return right.price - left.price;
      }

      return left.name.localeCompare(right.name);
    });

    container.innerHTML = products
      .map(
        (product) => `
          <article class="product-card">
            <div>
              <h3 class="inventory_item_name">${product.name}</h3>
              <div class="price inventory_item_price">$${product.price.toFixed(2)}</div>
            </div>
            <div class="product-actions">
              <button type="button" data-role="cart-toggle" data-product-id="${product.id}"></button>
            </div>
          </article>
        `
      )
      .join('');

    container.querySelectorAll('[data-role="cart-toggle"]').forEach((button) => {
      const productId = button.dataset.productId;
      setCartButtonState(button, productId);
      button.addEventListener('click', () => {
        if (productInCart(productId)) {
          writeCart(appState.cart.filter((item) => item !== productId));
        } else {
          writeCart([...appState.cart, productId]);
        }

        setCartButtonState(button, productId);
      });
    });
  }

  function renderCart() {
    const container = document.querySelector('[data-role="cart-items"]');
    if (!container) {
      return;
    }

    const items = appState.cart
      .map((productId) => appState.products.find((product) => product.id === productId))
      .filter(Boolean);

    container.innerHTML = items
      .map(
        (product) => `
          <article class="cart_item cart-item">
            <div class="cart-item-row">
              <h3 class="inventory_item_name">${product.name}</h3>
              <div class="price inventory_item_price">$${product.price.toFixed(2)}</div>
            </div>
          </article>
        `
      )
      .join('');
  }

  function showError(message) {
    const error = document.querySelector('[data-test="error"]');
    if (error) {
      error.textContent = message;
    }
  }

  async function loadProducts() {
    const response = await fetch(`${apiBase}/products`);
    appState.products = await response.json();
  }

  async function initLoginPage() {
    const form = document.querySelector('[data-role="login-form"]');
    if (!form) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.querySelector('[data-test="username"]').value.trim();
      const password = document.querySelector('[data-test="password"]').value;

      if (!username) {
        showError('Username is required');
        return;
      }

      if (!password) {
        showError('Password is required');
        return;
      }

      const response = await fetch(`${apiBase}/users`);
      const users = await response.json();
      const user = users.find((entry) => entry.username === username);

      if (!user || user.password !== password) {
        showError('Username and password do not match any user in this service');
        return;
      }

      if (user.locked) {
        showError('Sorry, this user has been locked out.');
        return;
      }

      localStorage.setItem('mock-user', username);
      window.location.assign('/inventory.html');
    });
  }

  async function initInventoryPage() {
    await loadProducts();

    const sortSelect = document.querySelector('[data-test="product-sort-container"]');
    if (sortSelect) {
      sortSelect.addEventListener('change', renderProductList);
    }

    const cartLink = document.querySelector('[data-role="cart-link"]');
    if (cartLink) {
      cartLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.assign('/cart.html');
      });
    }

    renderProductList();
    updateCartBadge();
  }

  async function initCartPage() {
    await loadProducts();
    renderCart();
    updateCartBadge();

    const proceedButton = document.querySelector('[data-test="checkout"]');
    if (proceedButton) {
      proceedButton.addEventListener('click', () => {
        window.location.assign('/checkout-step-one.html');
      });
    }

    const continueButton = document.querySelector('[data-test="continue-shopping"]');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        window.location.assign('/inventory.html');
      });
    }
  }

  function initCheckoutStepOnePage() {
    const form = document.querySelector('[data-role="checkout-form"]');
    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const firstName = document.querySelector('[data-test="firstName"]').value.trim();
      const lastName = document.querySelector('[data-test="lastName"]').value.trim();
      const postalCode = document.querySelector('[data-test="postalCode"]').value.trim();

      if (!firstName) {
        showError('First Name is required');
        return;
      }

      writeShipping({ firstName, lastName, postalCode });
      window.location.assign('/checkout-step-two.html');
    });
  }

  function renderCheckoutSummary() {
    const container = document.querySelector('[data-role="checkout-summary"]');
    const finishButton = document.querySelector('[data-test="finish"]');
    if (!container || !finishButton) {
      return;
    }

    const items = appState.cart
      .map((productId) => appState.products.find((product) => product.id === productId))
      .filter(Boolean);

    container.innerHTML = `
      <div class="summary_info">
        <div class="summary-card">
          <h3>Shipping</h3>
          <p>${appState.shipping?.firstName || ''} ${appState.shipping?.lastName || ''}</p>
          <p>${appState.shipping?.postalCode || ''}</p>
        </div>
      </div>
      <div class="summary-list">
        ${items
          .map(
            (product) => `
              <article class="cart_item cart-item">
                <div class="cart-item-row">
                  <h3 class="inventory_item_name">${product.name}</h3>
                  <div class="price inventory_item_price">$${product.price.toFixed(2)}</div>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    `;

    finishButton.addEventListener('click', () => {
      writeCart([]);
      localStorage.removeItem(shippingKey);
      container.innerHTML = `
        <div class="complete-banner">
          <h2 data-test="complete-header">Thank you for your order!</h2>
          <p>Your mock checkout finished successfully.</p>
        </div>
      `;
      finishButton.remove();
    });
  }

  async function initCheckoutStepTwoPage() {
    await loadProducts();
    renderCheckoutSummary();
  }

  async function init() {
    const page = document.body.dataset.page;

    if (page === 'login') {
      await initLoginPage();
      return;
    }

    if (page === 'inventory') {
      await initInventoryPage();
      return;
    }

    if (page === 'cart') {
      await initCartPage();
      return;
    }

    if (page === 'checkout-step-one') {
      initCheckoutStepOnePage();
      return;
    }

    if (page === 'checkout-step-two') {
      await initCheckoutStepTwoPage();
    }
  }

  init().catch((error) => {
    console.error(error);
    const errorSlot = document.querySelector('[data-test="error"]');
    if (errorSlot) {
      errorSlot.textContent = 'The mock app failed to start.';
    }
  });
})();