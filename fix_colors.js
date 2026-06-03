const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

index = index.replace(
    /color: var\(--text-primary\);(.*?)>Самая свежая/g,
    'color: #ffffff;$1>Самая свежая'
);

index = index.replace(
    /<h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 16px;">/g,
    '<h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 16px; color: #ffffff;">'
);

index = index.replace(
    /<h3 style="margin-right: 8px;">/g,
    '<h3 style="margin-right: 8px; color: #ffffff;">'
);

index = index.replace(
    /color: var\(--text-primary\);(.*?)>Безопасны ли/g,
    'color: #ffffff;$1>Безопасны ли'
);
index = index.replace(
    /color: var\(--text-primary\);(.*?)>Почему это/g,
    'color: #ffffff;$1>Почему это'
);


fs.writeFileSync('index.html', index);
console.log('Fixed forced black background child text colors.');
