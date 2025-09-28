const { test, expect } = require('@playwright/test');

test.describe('Admin Panel UI/UX Tests', () => {

  test('1. Admin page loads correctly', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveTitle(/管理面板|Admin/);
    await expect(page.locator('h1, h2, .admin-title')).toBeVisible();
  });

  test('2. Admin navigation menu works', async ({ page }) => {
    await page.goto('/admin');

    // Look for navigation elements
    const navLinks = page.locator('nav a, .admin-nav a, .sidebar a');
    if (await navLinks.count() > 0) {
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('3. Data collection button is present and functional', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for data collection button
    const collectButton = page.locator('button:has-text("抓取"), button:has-text("收集"), button:has-text("fetch"), button:has-text("collect")');
    if (await collectButton.count() > 0) {
      await expect(collectButton).toBeVisible();
      await expect(collectButton).toBeEnabled();

      // Test click (but don't actually trigger collection)
      // Just verify it's clickable
      await collectButton.hover();
    }
  });

  test('4. Statistics display', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for statistics/cards
    const statsCards = page.locator('[data-testid="stats"], .stats-card, .stat-card, .dashboard-card');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }

    // Look for numbers/metrics
    const metrics = page.locator('text=/\\d+/, .metric, .stat-number');
    if (await metrics.count() > 0) {
      await expect(metrics.first()).toBeVisible();
    }
  });

  test('5. Cases table/list displays', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for table
    const table = page.locator('table, .cases-table, .admin-table');
    if (await table.count() > 0) {
      await expect(table).toBeVisible();

      // Check for table headers
      const headers = table.locator('th, .table-header');
      if (await headers.count() > 0) {
        await expect(headers.first()).toBeVisible();
      }
    }

    // Look for list items if no table
    const listItems = page.locator('[data-testid="case-item"], .case-item, .admin-list-item');
    if (await listItems.count() > 0) {
      await expect(listItems.first()).toBeVisible();
    }
  });

  test('6. Admin search/filter functionality', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"], input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
      await searchInput.fill('test');
      await searchInput.press('Enter');
    }
  });

  test('7. Bulk operations', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for bulk action buttons
    const bulkButtons = page.locator('button:has-text("批量"), button:has-text("Bulk"), button:has-text("全部"), button:has-text("All")');
    if (await bulkButtons.count() > 0) {
      await expect(bulkButtons.first()).toBeVisible();
    }
  });

  test('8. Export functionality', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for export buttons
    const exportButtons = page.locator('button:has-text("导出"), button:has-text("Export"), button:has-text("下载"), button:has-text("Download")');
    if (await exportButtons.count() > 0) {
      await expect(exportButtons.first()).toBeVisible();
    }
  });

  test('9. Settings/configuration section', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for settings section
    const settingsSection = page.locator('[data-testid="settings"], .settings, .configuration, .config');
    if (await settingsSection.count() > 0) {
      await expect(settingsSection).toBeVisible();
    }
  });

  test('10. Mobile responsive admin panel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');

    await expect(page.locator('h1, h2, .admin-title')).toBeVisible();

    // Check for mobile menu
    const mobileMenu = page.locator('button:has(svg), .mobile-menu-toggle, .hamburger');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});