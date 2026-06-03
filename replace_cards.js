const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

index = index.replace(
    /<h3>Сайты и веб-сервисы<\/h3>/g,
    '<h3>Сайты</h3>'
);

const additionalCards = `
                    <div class="direction-card" style="background: #000000;">
                        <div class="direction-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        </div>
                        <h3>Python скрипты</h3>
                    </div>
                    <div class="direction-card" style="background: #000000;">
                        <div class="direction-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <h3>Расширения для браузеров</h3>
                    </div>
`;

index = index.replace(
    /<h3>Сайты<\/h3>\s*<\/div>/g,
    '<h3>Сайты</h3>\n                    </div>' + additionalCards
);

fs.writeFileSync('index.html', index);
console.log('Cards updated.');
