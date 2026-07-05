import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = ['index.html', 'pages/programs.html', 'pages/program_detail.html', 'pages/404.html'];
const requiredFiles = [
  'static/style.css',
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

async function validateProgramsData() {
  const source = await readFile(path.join(root, 'static/js/programs.js'), 'utf8');
  const match = source.match(/const PROGRAMS = (\[[\s\S]*?\n\]);/);
  if (!match) {
    fail('PROGRAMS array was not found in static/js/programs.js');
    return;
  }

  let programs;
  try {
    programs = JSON.parse(match[1]);
  } catch (error) {
    fail(`PROGRAMS array is not valid JSON-like data: ${error.message}`);
    return;
  }

  if (!Array.isArray(programs) || programs.length === 0) {
    fail('PROGRAMS must be a non-empty array');
    return;
  }

  const ids = new Set();
  for (const program of programs) {
    for (const field of ['id', 'name', 'description', 'full_description', 'version', 'link', 'cover_image', 'category']) {
      if (program[field] === undefined || program[field] === '') {
        fail(`Program ${program.name || program.id || 'unknown'} is missing field: ${field}`);
      }
    }

    if (ids.has(program.id)) {
      fail(`Duplicate program id: ${program.id}`);
    }
    ids.add(program.id);

    if (!Array.isArray(program.features) || program.features.length === 0) {
      fail(`Program ${program.name} must have non-empty features array`);
    }

    if (!Array.isArray(program.screenshots)) {
      fail(`Program ${program.name} screenshots must be an array`);
    }
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

if (errors.length > 0) {
  console.error('\nStatic site validation failed:\n');
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('✓ Static site validation passed');
