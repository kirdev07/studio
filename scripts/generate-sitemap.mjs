import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const siteUrl = 'https://kirdev07.github.io/kirdev-studio.github.io';
const programsPath = path.join(root, 'static/data/programs.json');
const sitemapPath = path.join(root, 'sitemap.xml');

function urlEntry(loc, changefreq = 'weekly', priority = '0.8') {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const programs = JSON.parse(await readFile(programsPath, 'utf8'));
const entries = [
  urlEntry(`${siteUrl}/`, 'weekly', '1.0'),
  urlEntry(`${siteUrl}/index.html`, 'weekly', '1.0'),
  urlEntry(`${siteUrl}/pages/programs.html`, 'weekly', '0.9'),
  ...programs.map((program) => urlEntry(`${siteUrl}/pages/programs/${encodeURIComponent(program.id)}.html`, 'monthly', '0.8'))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

await writeFile(sitemapPath, sitemap, 'utf8');
console.log(`✓ sitemap.xml generated with ${entries.length} URLs`);
