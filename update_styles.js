const fs = require('fs');

let css = fs.readFileSync('static/style.css', 'utf8');

css = css.replace(
    /\.direction-card \{[\s\S]*?background: var\(--glass-bg\);/g,
    '.direction-card {\n    background: #000000;'
);

css = css.replace(
    /\.direction-icon \{[\s\S]*?background: var\(--glass-bg\);/g,
    '.direction-icon {\n    width: 48px;\n    height: 48px;\n    border-radius: 12px;\n    background: #000000;'
);

fs.writeFileSync('static/style.css', css);
console.log('CSS updated successfully');
