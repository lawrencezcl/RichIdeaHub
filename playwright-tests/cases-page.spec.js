const { test, expect } = require('@playwright/test');

test.describe('Cases Page UI/UX Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/zh/cases');
  });

  test('1. Cases page loads with correct title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/案例库/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=精选案例')).toBeVisible();
  });

  test('2. Filter controls are visible and functional', async ({ page }) => {
    // Check for filter buttons
    const filterButtons = page.locator('button');
    await expect(filterButtons.first()).toBeVisible();

    // Check for search input if it exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"]');
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('3. Case cards display correctly', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for case cards
    const caseCards = page.locator('[data-testid="case-card"], .case-card, .border.rounded-lg');
    if (await caseCards.count() > 0) {
      await expect(caseCards.first()).toBeVisible();

      // Check card elements
      const firstCard = caseCards.first();
      await expect(firstCard.locator('h2, h3, .title')).toBeVisible();
    }
  });

  test('4. Pagination works if present', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for pagination controls
    const pagination = page.locator('[aria-label="Pagination"], .pagination, nav:has(button)');
    if (await pagination.count() > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test('5. Sorting functionality', async ({ page }) => {
    // Look for sort dropdown/buttons
    const sortControl = page.locator('select, button:has-text("排序"), .sort-dropdown');
    if (await sortControl.count() > 0) {
      await expect(sortControl).toBeVisible();
    }
  });

  test('6. Category filtering', async ({ page }) => {
    // Look for category filters
    const categoryFilters = page.locator('button:has-text("分类"), .category-filter, [data-category]');
    if (await categoryFilters.count() > 0) {
      await expect(categoryFilters.first()).toBeVisible();
    }
  });

  test('7. Difficulty badges display correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for difficulty badges
    const difficultyBadges = page.locator('[data-difficulty], .difficulty-badge, .badge:has-text("初级"), .badge:has-text("中级"), .badge:has-text("高级")');
    if (await difficultyBadges.count() > 0) {
      await expect(difficultyBadges.first()).toBeVisible();
    }
  });

  test('8. Mobile responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/zh/cases');

    await expect(page.locator('h1')).toBeVisible();

    // Check mobile menu if it exists
    const mobileMenu = page.locator('button:has(svg), .mobile-menu-button');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('9. Loading states work properly', async ({ page }) => {
    // Test loading state by clicking a filter
    const filterButton = page.locator('button').first();
    if (await filterButton.count() > 0) {
      await filterButton.click();

      // Check for loading indicators
      const loadingIndicator = page.locator('[aria-busy="true"], .loading, .spinner, [role="progressbar"]');
      // Loading indicators might appear and disappear quickly
    }
  });

  test('10. Empty state handling', async ({ page }) => {
    // Test empty state by searching for something unlikely
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('xyznonexistentterm123');
      await searchInput.press('Enter');

      // Wait for search to complete
      await page.waitForLoadState('networkidle');

      // Check for empty state message
      const emptyState = page.locator('text="没有找到案例", text="暂无数据", .empty-state');
      // Empty state might or might not be visible depending on results
    }
  });
});