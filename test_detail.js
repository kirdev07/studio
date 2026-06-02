const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/program_detail.html?id=1');
  // wait for a bit to let JS run
  await page.waitForTimeout(2000);
  const detailContainer = await page.$('#detail-container');
  if (detailContainer) {
      console.log("detail-container exists");
  } else {
      console.log("detail-container missing");
  }
  const counterText = await page.textContent('#detail-download-counter');
  console.log("Counter text:", counterText);
  const skeletonClass = await page.evaluate(() => document.querySelector('#detail-download-counter').classList.contains('skeleton'));
  console.log("Skeleton class present:", skeletonClass);
  await browser.close();
})();
