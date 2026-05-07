# Playwright Parallel Tests PoC — SauceDemo

Proof of concept for running Playwright tests in parallel using GitHub Actions matrix sharding.

## Structure

```
playwright-poc/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GH Actions — 3 parallel shards
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
automatically. At the end, a `merge-reports` job collects the blob reports
from all runners and produces a single HTML report artifact.

```
Shard 1/3 → ~6 tests   (≈ login + part of inventory)
Shard 2/3 → ~6 tests   (≈ inventory + cart)
Shard 3/3 → ~5 tests   (≈ checkout)
```

## Running locally

```bash
npm install
npx playwright install --with-deps
npx playwright test                     # all tests, local workers
npx playwright test --shard=1/3        # simulate a single shard
npx playwright show-report             # view HTML report
```

## Browsers

Chromium and Firefox are enabled in `playwright.config.ts`.
Comment out Firefox in the `projects` array to speed up local runs.

## Credentials

SauceDemo users are hard-coded (they're public):
- `standard_user` / `secret_sauce` — normal user
- `locked_out_user` / `secret_sauce` — locked, used to verify error flow
