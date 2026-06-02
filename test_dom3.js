const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('program_detail.html', 'utf8');
const scriptContent = fs.readFileSync('static/js/programs.js', 'utf8');

const dom = new JSDOM(html, {
    url: "https://example.com/program_detail.html?id=1",
});
dom.window.eval(scriptContent);
const event = new dom.window.Event('DOMContentLoaded');
dom.window.document.dispatchEvent(event);

setTimeout(() => {
    const detailContainer = dom.window.document.getElementById('detail-container');
    const detailCounter = dom.window.document.getElementById('detail-download-counter');
    console.log("detailContainer exists:", !!detailContainer);
    console.log("detailCounter text:", detailCounter ? detailCounter.textContent : "null");
}, 2000);
