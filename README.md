# Playwright Parallel Tests PoC — Mocked SauceDemo

Proof of concept for running Playwright tests in parallel using GitHub Actions matrix sharding, with a local mock app and JSON-backed API so CI does not depend on external services.

## Structure

```
playwright-poc/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GH Actions — 3 parallel shards
├── mock/
│   ├── api/
│   │   └── db.json             # json-server data
│   ├── public/
│   │   ├── client.js           # browser behavior for the mock app
│   │   └── styles.css          # mock app styling
│   └── server.tsx              # local mock app + API server
├── pages/                      # Page Object Models
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── login.spec.ts           # 4 tests
│   ├── inventory.spec.ts       # 7 tests
│   ├── cart.spec.ts            # 4 tests
│   └── checkout.spec.ts        # 2 tests (e2e)
└── playwright.config.ts
```

## How sharding works

GitHub Actions spins up 3 runners in parallel via a `matrix` strategy.
Each runner receives `--shard=N/3`, so Playwright divides the test suite
automatically. At the start of each run, Playwright launches the local mock
server on `http://127.0.0.1:3000` and waits for `/healthz` before executing the
tests.

```
Shard 1/3 → ~6 tests   (≈ login + part of inventory)
Shard 2/3 → ~6 tests   (≈ inventory + cart)
Shard 3/3 → ~5 tests   (≈ checkout)
```

## Running locally

```bash
npm install
npx playwright install --with-deps
npm run mock:serve                      # start the local mock app and API
npx playwright test                     # all tests, local workers
npx playwright test --shard=1/3        # simulate a single shard
npx playwright show-report             # view HTML report
```

## Mock backend

The Playwright config defaults `baseURL` to `http://127.0.0.1:3000` and starts
`mock/server.tsx` automatically for test runs. That server uses `json-server` for
API data under `/api` and serves a small local UI that mirrors the selectors the
tests expect.

To point the suite at a different environment, set `PLAYWRIGHT_BASE_URL`.
Set `PLAYWRIGHT_USE_MOCK_SERVER=false` when you do not want Playwright to boot
the local server.

## Browsers

Chromium and Firefox are enabled in `playwright.config.ts`.
Comment out Firefox in the `projects` array to speed up local runs.

## Credentials

SauceDemo users are hard-coded (they're public):
- `standard_user` / `secret_sauce` — normal user
- `locked_out_user` / `secret_sauce` — locked, used to verify error flow
