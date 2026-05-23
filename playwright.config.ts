/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
const useMockServer = process.env.PLAYWRIGHT_USE_MOCK_SERVER !== 'false' && baseURL.startsWith('http://127.0.0.1:3000');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,

  reporter: process.env.CI
    ? [['blob'], ['github']]           // blob for merging shards, github for PR annotations
    : [['html', { open: 'never' }]],

  webServer: useMockServer
    ? {
        command: 'npm run mock:serve',
        url: `${baseURL}/healthz`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
