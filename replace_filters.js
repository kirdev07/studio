const fs = require('fs');

let html = fs.readFileSync('programs.html', 'utf8');

html = html.replace(
    /<button class="filter-btn" data-filter="Скрипты">Скрипты<\/button>/g,
    '<button class="filter-btn" data-filter="Python скрипты">Python скрипты</button>\n                        <button class="filter-btn" data-filter="Расширения">Расширения</button>'
);

fs.writeFileSync('programs.html', html);
console.log('Filters updated in programs.html');
