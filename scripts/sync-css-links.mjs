import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = ['index.html', 'pages/programs.html', 'pages/program_detail.html', 'pages/404.html'];

const replacements = [
  {
    from: './static/style.css?v=1.4',
    to: './static/css/main.css?v=2.0'
  },
  {
    from: '../static/style.css?v=1.4',
    to: '../static/css/main.css?v=2.0'
  }
];

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  let content = await readFile(filePath, 'utf8');
  const original = content;

  for (const replacement of replacements) {
    content = content.replaceAll(replacement.from, replacement.to);
  }

  if (content !== original) {
    await writeFile(filePath, content, 'utf8');
    console.log(`✓ synced CSS link in ${file}`);
  }
}
