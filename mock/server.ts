import jsonServer = require('json-server');
import * as path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.MOCK_PORT || 3000);
const apiPath = path.resolve(__dirname, 'api', 'db.json');
const publicPath = path.resolve(__dirname, 'public');

const server = jsonServer.create();
const router = jsonServer.router(apiPath);
const middlewares = jsonServer.defaults({ static: publicPath });

server.use(middlewares);
server.use('/api', router);

server.get('/healthz', (_request, response) => {
  response.status(200).type('text/plain').send('ok');
});

function pageShell(pageName: string, title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="/styles.css" />
    <script src="/client.js" defer></script>
  </head>
  <body data-page="${pageName}">
    ${body}
  </body>
</html>`;
}

function loginPage() {
  return pageShell(
    'login',
    'Mock Sauce Login',
    `
      <main class="login-layout">
        <section class="login-card">
          <h1>Mock Sauce</h1>
          <p class="hint">Use the public SauceDemo credentials without touching the outside service.</p>
          <form data-role="login-form" class="field-group">
            <input data-test="username" name="username" placeholder="Username" autocomplete="username" />
            <input data-test="password" name="password" type="password" placeholder="Password" autocomplete="current-password" />
            <button data-test="login-button" type="submit">Login</button>
          </form>
          <div data-test="error" class="error-message"></div>
        </section>
      </main>
    `
  );
}

function inventoryPage() {
  return pageShell(
    'inventory',
    'Mock Inventory',
    `
      <main class="app-shell">
        <section class="page-card">
          <header class="page-header">
            <div class="brand">Mock Sauce</div>
            <a class="cart-link shopping_cart_link" data-role="cart-link" href="/cart.html" aria-label="Cart">
              <span>Cart</span>
              <span class="cart-badge shopping_cart_badge" hidden></span>
            </a>
          </header>
          <div class="content">
            <h1 class="page-title title">Products</h1>
            <div class="toolbar">
              <p class="page-copy">A local replica of the SauceDemo flows powered by json-server data.</p>
              <select data-test="product-sort-container" aria-label="Sort products">
                <option value="az">Name (A to Z)</option>
                <option value="za">Name (Z to A)</option>
                <option value="lohi">Price (low to high)</option>
                <option value="hilo">Price (high to low)</option>
              </select>
            </div>
            <section data-role="product-list" class="product-grid"></section>
          </div>
        </section>
      </main>
    `
  );
}

function cartPage() {
  return pageShell(
    'cart',
    'Mock Cart',
    `
      <main class="app-shell">
        <section class="page-card">
          <header class="page-header">
            <div class="brand">Mock Sauce</div>
            <a class="cart-link shopping_cart_link" href="/inventory.html">Back to inventory</a>
          </header>
          <div class="content">
            <h1 class="page-title">Your Cart</h1>
            <p class="page-copy">Items are persisted in local storage so the flow stays deterministic in CI.</p>
            <section data-role="cart-items" class="cart-list"></section>
            <div class="checkout-actions" style="margin-top: 20px;">
              <button data-test="continue-shopping" type="button" class="secondary-button">Continue Shopping</button>
              <button data-test="checkout" type="button">Checkout</button>
            </div>
          </div>
        </section>
      </main>
    `
  );
}

function checkoutStepOnePage() {
  return pageShell(
    'checkout-step-one',
    'Mock Checkout Step One',
    `
      <main class="app-shell">
        <section class="page-card">
          <header class="page-header">
            <div class="brand">Mock Sauce</div>
            <a class="cart-link shopping_cart_link" href="/cart.html">Cart</a>
          </header>
          <div class="content">
            <h1 class="page-title">Checkout Information</h1>
            <form data-role="checkout-form" class="checkout-panel field-group">
              <input data-test="firstName" name="firstName" placeholder="First Name" />
              <input data-test="lastName" name="lastName" placeholder="Last Name" />
              <input data-test="postalCode" name="postalCode" placeholder="Postal Code" />
              <button data-test="continue" type="submit">Continue</button>
            </form>
            <div data-test="error" class="error-message"></div>
          </div>
        </section>
      </main>
    `
  );
}

function checkoutStepTwoPage() {
  return pageShell(
    'checkout-step-two',
    'Mock Checkout Step Two',
    `
      <main class="app-shell">
        <section class="page-card">
          <header class="page-header">
            <div class="brand">Mock Sauce</div>
            <a class="cart-link shopping_cart_link" href="/cart.html">Cart</a>
          </header>
          <div class="content">
            <h1 class="page-title">Overview</h1>
            <p class="page-copy">This mirrors the final SauceDemo review screen closely enough for the locator-based tests.</p>
            <section data-role="checkout-summary"></section>
            <div class="checkout-actions" style="margin-top: 20px;">
              <button data-test="finish" type="button">Finish</button>
            </div>
          </div>
        </section>
      </main>
    `
  );
}

server.get('/', (_request, response) => {
  response.type('html').send(loginPage());
});

server.get('/inventory.html', (_request, response) => {
  response.type('html').send(inventoryPage());
});

server.get('/cart.html', (_request, response) => {
  response.type('html').send(cartPage());
});

server.get('/checkout-step-one.html', (_request, response) => {
  response.type('html').send(checkoutStepOnePage());
});

server.get('/checkout-step-two.html', (_request, response) => {
  response.type('html').send(checkoutStepTwoPage());
});

server.listen(port, host, () => {
  console.log(`Mock app listening on http://${host}:${port}`);
});