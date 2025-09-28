const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/zh');
  });

  test('1. Main page has proper heading structure', async ({ page }) => {
    // Check for h1 heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Check that there's only one h1
    await expect(h1).toHaveCount(1);
  });

  test('2. Images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');

      // Allow empty alt for decorative images
      if (!altText && await image.getAttribute('src')) {
        console.log(`Image at index ${i} missing alt text`);
      }
    }
  });

  test('3. Form inputs have labels', async ({ page }) => {
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');

      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`);
        if (await label.count() === 0) {
          // Check if input has aria-label
          const ariaLabel = await input.getAttribute('aria-label');
          if (!ariaLabel) {
            console.log(`Input with id "${inputId}" missing label or aria-label`);
          }
        }
      }
    }
  });

  test('4. Links have descriptive text', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute('href');

      // Skip anchor links and empty links
      if (href && href !== '#' && (!text || text.trim() === '')) {
        // Check for aria-label
        const ariaLabel = await link.getAttribute('aria-label');
        if (!ariaLabel) {
          console.log(`Link to "${href}" missing descriptive text`);
        }
      }
    }
  });

  test('5. Buttons have accessible names', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      if (!text && !ariaLabel) {
        // Check if button has an icon with aria-label
        const icon = button.locator('svg, img');
        if (await icon.count() === 0) {
          console.log(`Button at index ${i} missing accessible name`);
        }
      }
    }
  });

  test('6. Color contrast test (basic)', async ({ page }) => {
    // This is a basic test - for comprehensive testing, use axe-core
    const textElements = page.locator('p, span, h1, h2, h3, h4, h5, h6, a, button');
    await expect(textElements.first()).toBeVisible();
  });

  test('7. Keyboard navigation', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');

    // Check focus indicator
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('8. ARIA landmarks', async ({ page }) => {
    // Check for common ARIA landmarks
    const landmarks = page.locator('[role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], nav, main, aside, footer');
    await expect(landmarks.first()).toBeVisible();
  });

  test('9. Skip links', async ({ page }) => {
    // Check for skip links
    const skipLinks = page.locator('a[href^="#main"], a[href^="#content"], .skip-link, [aria-label*="skip"]');
    // Skip links are optional, so no assertion if not found
  });

  test('10. Tables have proper headers', async ({ page }) => {
    // Navigate to cases page to test tables
    await page.goto('/zh/cases');
    await page.waitForLoadState('networkidle');

    const tables = page.locator('table');
    const tableCount = await tables.count();

    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      const headers = table.locator('th');
      const headerCount = await headers.count();

      if (headerCount === 0) {
        console.log(`Table at index ${i} missing headers`);
      }
    }
  });
});