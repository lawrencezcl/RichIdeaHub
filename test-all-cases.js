const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing ALL case links on production site...');

  const browser = await chromium.launch({
    headless: true,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    // Get all case links first
    console.log('📋 Getting all case links...');
    await page.goto('https://www.richidea.club/cases');
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('a[href^="/cases/"]', { timeout: 15000 });

    const caseLinks = await page.$$eval('a[href^="/cases/"]', links =>
      links.map(link => link.href).filter(href => href && href.includes('/cases/'))
    );

    // Remove duplicates
    const uniqueLinks = [...new Set(caseLinks)];
    console.log(`🔍 Found ${uniqueLinks.length} unique case links to test`);

    let passedTests = 0;
    let failedTests = 0;

    // Test all case links
    for (let i = 0; i < uniqueLinks.length; i++) {
      const link = uniqueLinks[i];
      console.log(`🧪 Testing case ${i + 1}/${uniqueLinks.length}: ${link}`);

      try {
        await page.goto(link);
        await page.waitForLoadState('networkidle', { timeout: 10000 });

        // Check if case detail page loaded correctly
        const title = await page.$eval('h1', el => el.textContent).catch(() => null);
        const backButton = await page.$('text=返回案例库').catch(() => null);
        const caseId = link.split('/').pop();

        if (title && backButton) {
          console.log(`✅ Case ${caseId}: ${title.substring(0, 60)}...`);
          passedTests++;
        } else {
          console.log(`❌ Case ${caseId}: Failed to load properly`);
          failedTests++;
        }

        // Test a few specific elements that should be on case detail pages
        const hasStats = await page.$('.grid').catch(() => null);
        const hasContent = await page.$('text=/收入水平|时间投入|成功率/').catch(() => null);

        if (!hasStats || !hasContent) {
          console.log(`⚠️  Case ${caseId}: Missing some expected content`);
        }

      } catch (error) {
        console.log(`❌ Error testing case ${link.split('/').pop()}: ${error.message}`);
        failedTests++;
      }
    }

    console.log('\n🎯 Test Summary:');
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / uniqueLinks.length) * 100).toFixed(1)}%`);

    if (failedTests === 0) {
      console.log('\n🎉 ALL CASE LINKS ARE WORKING PERFECTLY!');
    } else {
      console.log('\n⚠️  Some case links may need attention');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();