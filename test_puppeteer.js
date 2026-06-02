const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/program_detail.html?id=1');
  await new Promise(r => setTimeout(r, 2000));

  const hasDetailContainer = await page.$eval('#detail-container', el => !!el).catch(() => false);
  console.log("hasDetailContainer:", hasDetailContainer);

  if (hasDetailContainer) {
      const counterText = await page.$eval('#detail-download-counter', el => el.textContent).catch(e => "counter not found");
      console.log("Counter text:", counterText);
  }

  await browser.close();
})();
