import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteUrl = 'https://kirdev07.github.io/kirdev-studio.github.io';
const htmlFiles = ['index.html', 'pages/programs.html', 'pages/program_detail.html', 'pages/404.html'];
const requiredFiles = [
  'robots.txt',
  'sitemap.xml',
  'vite.config.js',
  'scripts/generate-sitemap.mjs',
  'scripts/generate-program-pages.mjs',
  'static/style.css',
  'static/css/main.css',
  'static/css/tokens.css',
  'static/css/base.css',
  'static/css/layout.css',
  'static/css/components.css',
  'static/css/pages.css',
  'static/css/utilities.css',
  'static/data/programs.json',
  'static/js/main.js',
  'static/js/programs.js',
  'static/js/catalog.js',
  'static/js/program-detail.js',
  'pages/404.html'
];

const errors = [];

function fail(message) {
  errors.push(`✗ ${message}`);
}

function assertFileExists(filePath) {
  if (!existsSync(path.join(root, filePath))) {
    fail(`Missing required file: ${filePath}`);
  }
}

function resolveAssetPath(htmlFile, assetPath) {
  const cleanPath = assetPath.split('?')[0].split('#')[0];
  if (/^(https?:)?\/\//.test(cleanPath) || cleanPath.startsWith('mailto:') || cleanPath.startsWith('tel:')) {
    return null;
  }

  const baseDir = path.dirname(htmlFile);
  return path.normalize(path.join(baseDir, cleanPath));
}

async function validateHtmlAssets(htmlFile) {
  const html = await readFile(path.join(root, htmlFile), 'utf8');
  const assetRegex = /(?:href|src)="([^"]+)"/g;
  const inlineScriptRegex = /<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi;
  const onclickRegex = /\son[a-z]+="/i;

  const inlineScripts = html.match(inlineScriptRegex) || [];
  const executableInlineScripts = inlineScripts.filter((script) => !script.includes('application/ld+json'));
  if (executableInlineScripts.length > 0) {
    fail(`${htmlFile} contains inline executable script blocks`);
  }

  if (onclickRegex.test(html)) {
    fail(`${htmlFile} contains inline event handlers`);
  }

  for (const match of html.matchAll(assetRegex)) {
    const assetPath = resolveAssetPath(htmlFile, match[1]);
    if (!assetPath) continue;

    if (assetPath.startsWith('pages/pages/')) continue;
    if (assetPath.endsWith('.html') && assetPath.includes('?')) continue;

    if (!existsSync(path.join(root, assetPath))) {
      fail(`${htmlFile} references missing asset: ${match[1]} -> ${assetPath}`);
    }
  }
}

function validateProgramList(programs, sourceName) {
  if (!Array.isArray(programs) || programs.length === 0) {
    fail(`${sourceName} must be a non-empty array`);
    return;
  }

  const ids = new Set();
  for (const program of programs) {
    for (const field of ['id', 'name', 'description', 'full_description', 'version', 'link', 'cover_image', 'category']) {
      if (program[field] === undefined || program[field] === '') {
        fail(`${sourceName}: program ${program.name || program.id || 'unknown'} is missing field: ${field}`);
      }
    }

    if (ids.has(program.id)) {
      fail(`${sourceName}: duplicate program id: ${program.id}`);
    }
    ids.add(program.id);

    if (!Array.isArray(program.features) || program.features.length === 0) {
      fail(`${sourceName}: program ${program.name} must have non-empty features array`);
    }

    if (!Array.isArray(program.screenshots)) {
      fail(`${sourceName}: program ${program.name} screenshots must be an array`);
    }
  }
}

async function getProgramsData() {
  const jsonSource = await readFile(path.join(root, 'static/data/programs.json'), 'utf8');

  try {
    return JSON.parse(jsonSource);
  } catch (error) {
    fail(`static/data/programs.json is invalid JSON: ${error.message}`);
    return [];
  }
}

async function validateProgramsData() {
  const programsFromJson = await getProgramsData();
  validateProgramList(programsFromJson, 'static/data/programs.json');

  const jsSource = await readFile(path.join(root, 'static/js/programs.js'), 'utf8');
  if (!jsSource.includes('static/data/programs.json')) {
    fail('static/js/programs.js should reference static/data/programs.json as the external data source');
  }
}

async function validateGeneratedProgramPages() {
  const generator = await readFile(path.join(root, 'scripts/generate-program-pages.mjs'), 'utf8');
  if (!generator.includes('pages/programs')) {
    fail('program page generator should write files into pages/programs');
  }

  const viteConfig = await readFile(path.join(root, 'vite.config.js'), 'utf8');
  if (!viteConfig.includes('generatedProgramPageInputs')) {
    fail('vite.config.js should include generated program pages in the build input');
  }
}

async function validateCssEntrypoint() {
  const css = await readFile(path.join(root, 'static/css/main.css'), 'utf8');
  for (const layer of ['tokens.css', 'base.css', 'layout.css', 'components.css', 'pages.css', 'utilities.css']) {
    if (!css.includes(layer)) {
      fail(`static/css/main.css does not import ${layer}`);
    }
  }
}

async function validateSeoFiles() {
  const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
  if (!robots.includes('User-agent: *')) {
    fail('robots.txt should include User-agent: *');
  }
  if (!robots.includes(`${siteUrl}/sitemap.xml`)) {
    fail('robots.txt should reference the sitemap URL');
  }

  const sitemapSource = await readFile(path.join(root, 'scripts/generate-sitemap.mjs'), 'utf8');
  if (!sitemapSource.includes('pages/programs/${encodeURIComponent(program.id)}.html')) {
    fail('sitemap generator should use generated static program pages');
  }
}

for (const file of requiredFiles) {
  assertFileExists(file);
}

for (const htmlFile of htmlFiles) {
  if (existsSync(path.join(root, htmlFile))) {
    await validateHtmlAssets(htmlFile);
  }
}

await validateProgramsData();
await validateGeneratedProgramPages();
await validateCssEntrypoint();
await validateSeoFiles();

if (errors.length > 0) {
  console.error('\nStatic site validation failed:\n');
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('✓ Static site validation passed');
