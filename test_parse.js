const fs = require('fs');
const html = fs.readFileSync('program_detail.html', 'utf8');
if (html.includes('id="detail-container"')) {
    console.log("detail-container exists in HTML");
}
