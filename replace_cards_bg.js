const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

index = index.replace(
    /<div class="direction-card">/g,
    '<div class="direction-card" style="background: #000000;">'
);

fs.writeFileSync('index.html', index);
console.log('direction-cards background replacements done.');
