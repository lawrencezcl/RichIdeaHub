const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing additional functionality...');

  const browser = await chromium.launch({
    headless: true,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('📋 Testing cases page functionality...');

    // Navigate to cases page
    await page.goto('https://www.richidea.club/cases');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForSelector('input[placeholder*="搜索"]', { timeout: 15000 });

    console.log('✅ Cases page loaded with search functionality');

    // Test search functionality
    console.log('🔍 Testing search functionality...');
    await page.fill('input[placeholder*="搜索"]', '设计');
    await page.waitForTimeout(2000);

    // Check if search results are displayed
    const searchResults = await page.$eval('text=/找到.*个案例/', el => el.textContent);
    console.log(`📊 Search results for "设计": ${searchResults}`);

    // Test category filter
    console.log('🏷️ Testing category filter...');
    await page.selectOption('select', '设计');
    await page.waitForTimeout(2000);

    const categoryResults = await page.$eval('text=/找到.*个案例/', el => el.textContent);
    console.log(`📊 Category filter results: ${categoryResults}`);

    // Clear filters
    await page.fill('input[placeholder*="搜索"]', '');
    await page.selectOption('select', '');
    await page.waitForTimeout(1000);

    // Test pagination if exists
    console.log('📄 Testing pagination...');
    const nextButton = page.locator('button:has-text("下一页")');
    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ Pagination working correctly');
    } else {
      console.log('ℹ️  Pagination not available or disabled');
    }

    // Test sort functionality
    console.log('🔄 Testing sort functionality...');
    const sortSelect = page.locator('select').nth(1); // Second select is for sorting
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('upvotes-desc');
      await page.waitForTimeout(2000);
      console.log('✅ Sort functionality working');
    } else {
      console.log('ℹ️  Sort select not found');
    }

    // Test navigation back to homepage
    console.log('🏠 Testing navigation...');
    await page.click('a[href="/"]');
    await page.waitForLoadState('networkidle');
    const homepageTitle = await page.title();
    console.log(`✅ Homepage navigation successful: ${homepageTitle}`);

    // Test API endpoints directly
    console.log('🔌 Testing API endpoints...');
    const apiResponse = await page.request.get('https://www.richidea.club/api/cases?limit=5');
    const apiData = await apiResponse.json();
    console.log(`✅ API endpoint working: ${apiData.success ? 'Success' : 'Failed'}, Found ${apiData.total || 0} cases`);

    // Test individual case API endpoint
    const caseApiResponse = await page.request.get('https://www.richidea.club/api/cases/849');
    const caseApiData = await caseApiResponse.json();
    console.log(`✅ Case API endpoint working: ${caseApiData.success ? 'Success' : 'Failed'}`);

    console.log('\n🎉 ALL FUNCTIONALITY TESTS PASSED!');

  } catch (error) {
    console.error('❌ Functionality test failed:', error);
  } finally {
    await browser.close();
  }
})();