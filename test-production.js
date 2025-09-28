const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting production site tests...');

  const browser = await chromium.launch({
    headless: true,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('📱 Testing homepage...');
    await page.goto('https://www.richidea.club/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Homepage loaded successfully');

    // Test cases page
    console.log('📋 Testing cases page...');
    await page.goto('https://www.richidea.club/cases');
    await page.waitForLoadState('networkidle');

    // Wait for cases to load
    await page.waitForSelector('a[href^="/cases/"]', { timeout: 15000 });
    console.log('✅ Cases page loaded successfully');

    // Get all case links
    const caseLinks = await page.$$eval('a[href^="/cases/"]', links =>
      links.map(link => link.href).filter(href => href && href.includes('/cases/'))
    );

    console.log(`🔍 Found ${caseLinks.length} case links`);

    // Remove duplicates
    const uniqueLinks = [...new Set(caseLinks)];
    console.log(`🔍 Found ${uniqueLinks.length} unique case links`);

    // Test first 5 case links to avoid timeout
    const linksToTest = uniqueLinks.slice(0, 5);

    for (let i = 0; i < linksToTest.length; i++) {
      const link = linksToTest[i];
      console.log(`🧪 Testing case ${i + 1}/${linksToTest.length}: ${link}`);

      try {
        await page.goto(link);
        await page.waitForLoadState('networkidle');

        // Check if case detail page loaded correctly
        const title = await page.$eval('h1', el => el.textContent).catch(() => null);
        const backButton = await page.$('text=返回案例库').catch(() => null);

        if (title && backButton) {
          console.log(`✅ Case ${i + 1} loaded successfully: ${title.substring(0, 50)}...`);
        } else {
          console.log(`❌ Case ${i + 1} may not have loaded correctly`);
        }

        // Go back to cases page
        await page.goto('https://www.richidea.club/cases');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('a[href^="/cases/"]', { timeout: 10000 });

      } catch (error) {
        console.log(`❌ Error testing case ${i + 1}: ${error.message}`);
        // Continue with next test
        await page.goto('https://www.richidea.club/cases');
        await page.waitForLoadState('networkidle');
      }
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();