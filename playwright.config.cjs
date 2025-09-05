const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/test/',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    //{
    //  name: 'firefox',
    //  use: { ...devices['Desktop Firefox'] },
    //},
    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},
    //{
    //  name: 'mobile-chrome',
    //  use: { ...devices['Pixel 5'] },
    //},
    //{
    //  name: 'mobile-safari',
    //  use: { ...devices['iPhone 12'] },
    //},
  ],

  webServer: [
    {
      command: 'npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'cd ../backend && npm start',
      url: 'http://localhost:5000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    }
  ],
});
