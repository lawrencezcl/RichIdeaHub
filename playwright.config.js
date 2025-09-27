const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playwright-tests',
  timeout: 30000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://38.147.171.132:3001',
    trace: 'off',
    screenshot: 'off',
  },
});