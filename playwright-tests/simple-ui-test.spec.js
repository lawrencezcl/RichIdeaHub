const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = 'http://localhost:3001';

test.describe('Rich Idea Hub Basic UI Tests', () => {

  test('1. Homepage redirects to English by default', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveURL(/\/en$/);
    await expect(page).toHaveTitle(/Rich Idea Hub/);
  });

  test('2. Chinese locale page works', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);
    await expect(page).toHaveURL(/\/zh$/);
    await expect(page.locator('text=副业案例库')).toBeVisible();
    await expect(page.locator('text=立即探索')).toBeVisible();
  });

  test('3. English locale page works', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('text=副业案例库')).toBeVisible();
  });

  test('4. Navigation menu works', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // Test cases navigation
    await page.click('text=案例库');
    await expect(page).toHaveURL(/\/zh\/cases$/);

    // Test admin navigation
    await page.goto(`${BASE_URL}/zh`);
    await page.click('text=管理');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('5. Email capture form is functional', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // Find and fill email form
    const emailInput = page.locator('input[placeholder*="邮箱"]');
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@example.com');

    // Check submit button
    const submitButton = page.locator('button:has-text("立即订阅")');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('6. Language switching works', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // Switch to English
    await page.click('a[href="/en"]');
    await expect(page).toHaveURL(/\/en$/);

    // Switch back to Chinese
    await page.click('a[href="/zh"]');
    await expect(page).toHaveURL(/\/zh$/);
  });

  test('7. Cases page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/cases`);
    await expect(page).toHaveURL(/\/zh\/cases$/);
    await expect(page.locator('text=精选案例')).toBeVisible();
    await expect(page.locator('text=AI 智能聚合')).toBeVisible();
  });

  test('8. Admin page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('9. Favorites page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/favorites`);
    await expect(page).toHaveURL(/\/favorites$/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('10. Mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/zh`);

    await expect(page.locator('text=副业案例库')).toBeVisible();
    await expect(page.locator('text=立即探索')).toBeVisible();

    // Check for mobile menu
    const mobileMenu = page.locator('header button:has(svg)');
    await expect(mobileMenu).toBeVisible();
  });
});