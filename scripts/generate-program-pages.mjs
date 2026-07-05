import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const programsPath = path.join(root, 'static/data/programs.json');
const outputDir = path.join(root, 'pages/programs');
const siteUrl = 'https://kirdev07.github.io/kirdev-studio.github.io';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeImagePath(pathValue) {
  return pathValue.replace('./static/', '../../static/');
}

function getSocialImage(program) {
  const imagePath = program.cover_image || './static/images/hero_illustration.jpg';
  return `${siteUrl}/${imagePath.replace('./', '')}`;
}

function renderProgramPage(program) {
  const title = `${escapeHtml(program.name)} — Скачать бесплатно на KirDev Studio`;
  const description = escapeHtml(program.description);
  const socialImage = getSocialImage(program);
  const canonical = `${siteUrl}/pages/programs/${encodeURIComponent(program.id)}.html`;
  const features = program.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('\n                    ');
  const screenshots = (program.screenshots || [])
    .map((shot) => `<img loading="lazy" src="${normalizeImagePath(shot)}" alt="Скриншот ${escapeHtml(program.name)}">`)
    .join('\n                    ');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/svg+xml" href="../../static/favicon_code.svg?v=4">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../static/css/main.css?v=2.0">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${socialImage}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="KirDev Studio">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${socialImage}">
</head>
<body>
    <div class="glow-orb" aria-hidden="true"></div>
    <div class="glow-orb orb-2" aria-hidden="true"></div>

    <header class="header">
        <div class="container header-inner">
            <div class="logo-wrapper">
                <a href="../../index.html" class="logo">KirDev <span>Studio</span></a>
            </div>
            <button class="menu-toggle" aria-label="Открыть меню" id="mobile-menu">
                <span></span><span></span><span></span>
            </button>
            <nav class="nav" id="nav-links">
                <a href="../../index.html">Главная</a>
                <a href="../programs.html">Разработки</a>
                <a href="https://t.me/kirdev_studio" target="_blank" rel="noopener noreferrer">Telegram</a>
                <a href="https://vk.com/kirdev_07" target="_blank" rel="noopener noreferrer">VK</a>
            </nav>
        </div>
    </header>

    <main>
        <section class="detail-page-section">
            <div class="container detail-container">
                <a href="../programs.html" class="detail-back-link">← Назад к разработкам</a>
                <div class="detail-hero-block">
                    <h1 class="detail-title-main">${escapeHtml(program.name)}</h1>
                    <div class="detail-meta">
                        <span class="version-badge detail-version">v${escapeHtml(program.version)}</span>
                        <span>•</span>
                        <span>${escapeHtml(program.category)}</span>
                    </div>
                    <div class="detail-actions-wrapper">
                        <a href="${escapeHtml(program.link)}" target="_blank" rel="noopener noreferrer" class="download-btn detail-download-btn detail-action-btn">Скачать безопасно</a>
                    </div>
                </div>

                <div class="detail-section">
                    <h2 class="detail-section-title">О разработке</h2>
                    <p class="detail-description">${escapeHtml(program.full_description)}</p>
                    <h3 class="detail-subtitle">Ключевые возможности:</h3>
                    <ul class="feature-list">
                    ${features}
                    </ul>
                </div>

                <h2 class="screenshots-title">Скриншоты</h2>
                <div class="generated-screenshots-grid">
                    ${screenshots || '<p class="empty-copy">Скриншоты скоро появятся.</p>'}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h2>KirDev Studio</h2>
                    <p>Надежные и безопасные программы для ваших задач.</p>
                </div>
                <div class="footer-links">
                    <p>&copy; 2026 KirDev Studio. Все права защищены.</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="../../static/js/main.js?v=1.1"></script>
</body>
</html>
`;
}

const programs = JSON.parse(await readFile(programsPath, 'utf8'));
await mkdir(outputDir, { recursive: true });

for (const program of programs) {
  const filePath = path.join(outputDir, `${program.id}.html`);
  await writeFile(filePath, renderProgramPage(program), 'utf8');
}

console.log(`✓ generated ${programs.length} static program page(s)`);
