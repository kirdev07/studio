const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/programs.html');
  await page.waitForTimeout(1000);
  const filtersText = await page.textContent('.filter-container');
  console.log("Filters:", filtersText);
  await browser.close();
})();
