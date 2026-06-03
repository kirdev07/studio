const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(1000);
  const sectionsText = await page.textContent('.directions-grid');
  console.log("Directions Grid:", sectionsText);
  await browser.close();
})();
