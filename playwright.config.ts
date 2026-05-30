import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4173/reward-chart/' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173/reward-chart/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
