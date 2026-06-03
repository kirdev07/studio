const fs = require('fs');

let css = fs.readFileSync('static/style.css', 'utf8');

css = css + '\n\n.direction-card h3 {\n    color: #ffffff !important;\n}\n.faq-trigger {\n    color: #ffffff !important;\n}';
fs.writeFileSync('static/style.css', css);

let index = fs.readFileSync('index.html', 'utf8');
index = index.replace(
    /color: var\(--text-primary\);(.*?)>Kiro Bot/g,
    'color: #ffffff;$1>Kiro Bot'
);
fs.writeFileSync('index.html', index);

console.log('Fixed text colors');
