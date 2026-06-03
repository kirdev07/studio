const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

index = index.replace(
    /<div class="featured-card"[^>]*background: var\(--glass-bg\);[^>]*>/g,
    (match) => match.replace('background: var(--glass-bg);', 'background: #000000;')
);

index = index.replace(
    /<div class="faq-item"[^>]*background: var\(--glass-bg\);[^>]*>/g,
    (match) => match.replace('background: var(--glass-bg);', 'background: #000000;')
);

fs.writeFileSync('index.html', index);
console.log('Index HTML background replacements done.');
