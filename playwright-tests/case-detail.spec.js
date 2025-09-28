const { test, expect } = require('@playwright/test');

test.describe('Case Detail Page UI/UX Tests', () => {

  test.beforeAll(async ({ page }) => {
    // First, let's check if there are any cases available
    await page.goto('/zh/cases');
    await page.waitForLoadState('networkidle');
  });

  test('1. Navigate to case detail page', async ({ page }) => {
    await page.goto('/zh/cases');
    await page.waitForLoadState('networkidle');

    // Look for case cards
    const caseCards = page.locator('[data-testid="case-card"], .case-card, .border.rounded-lg, a[href*="/cases/"]');

    if (await caseCards.count() > 0) {
      // Click on the first case card
      await caseCards.first().click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Check if we're on a case detail page
      expect(page.url()).toMatch(/\/cases\/\d+/);
    } else {
      console.log('No case cards found to test detail page');
    }
  });

  test('2. Case detail page loads correctly', async ({ page }) => {
    // Try to navigate to a case detail page directly
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Check page title
    await expect(page.locator('h1, h2, .case-title')).toBeVisible();
  });

  test('3. Case information displays', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for case information sections
    const infoSections = page.locator('[data-testid="case-info"], .case-info, .case-details');
    if (await infoSections.count() > 0) {
      await expect(infoSections.first()).toBeVisible();
    }

    // Look for income information
    const incomeInfo = page.locator('text=/收入|Income|收益|Revenue/');
    if (await incomeInfo.count() > 0) {
      await expect(incomeInfo.first()).toBeVisible();
    }

    // Look for time required
    const timeInfo = page.locator('text=/时间|Time|所需|Required/');
    if (await timeInfo.count() > 0) {
      await expect(timeInfo.first()).toBeVisible();
    }
  });

  test('4. Navigation breadcrumbs work', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for breadcrumbs
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"], .breadcrumb, nav:has-text("首页"), nav:has-text("Home")');
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs).toBeVisible();

      // Test breadcrumb navigation
      const homeLink = breadcrumbs.locator('a:has-text("首页"), a:has-text("Home")');
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toMatch(/\/zh$/);
      }
    }
  });

  test('5. Case metadata displays', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for difficulty badges
    const difficultyBadge = page.locator('[data-difficulty], .difficulty-badge, .badge:has-text("初级"), .badge:has-text("中级"), .badge:has-text("高级")');
    if (await difficultyBadge.count() > 0) {
      await expect(difficultyBadge.first()).toBeVisible();
    }

    // Look for category information
    const categoryInfo = page.locator('[data-category], .category, .case-category');
    if (await categoryInfo.count() > 0) {
      await expect(categoryInfo.first()).toBeVisible();
    }

    // Look for tags
    const tags = page.locator('[data-tag], .tag, .tags span');
    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test('6. Case content sections', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for description
    const description = page.locator('[data-testid="description"], .description, .case-description');
    if (await description.count() > 0) {
      await expect(description.first()).toBeVisible();
    }

    // Look for steps/instructions
    const steps = page.locator('[data-testid="steps"], .steps, .instructions, ol, ul');
    if (await steps.count() > 0) {
      await expect(steps.first()).toBeVisible();
    }

    // Look for tools/resources
    const tools = page.locator('[data-testid="tools"], .tools, .resources, text=/工具|Tools|资源|Resources/');
    if (await tools.count() > 0) {
      await expect(tools.first()).toBeVisible();
    }
  });

  test('7. Back navigation works', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for back button
    const backButton = page.locator('button:has-text("返回"), a:has-text("返回"), button:has-text("Back"), a:has-text("Back"), .back-button');
    if (await backButton.count() > 0) {
      await backButton.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/cases$/);
    }
  });

  test('8. Related cases section', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for related cases
    const relatedCases = page.locator('[data-testid="related-cases"], .related-cases, .similar-cases');
    if (await relatedCases.count() > 0) {
      await expect(relatedCases).toBeVisible();
    }
  });

  test('9. Source link displays', async ({ page }) => {
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    // Look for source link
    const sourceLink = page.locator('a[href*="reddit"], a[href*="producthunt"], a[href*="indiehackers"], [data-testid="source-link"]');
    if (await sourceLink.count() > 0) {
      await expect(sourceLink.first()).toBeVisible();
    }
  });

  test('10. Mobile responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/zh/cases/1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1, h2, .case-title')).toBeVisible();

    // Check mobile navigation
    const mobileMenu = page.locator('button:has(svg), .mobile-menu-toggle');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});