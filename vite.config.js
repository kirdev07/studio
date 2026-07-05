import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const generatedProgramPagesDir = resolve(__dirname, 'pages/programs');
const generatedProgramPageInputs = existsSync(generatedProgramPagesDir)
  ? Object.fromEntries(
      readdirSync(generatedProgramPagesDir)
        .filter((file) => file.endsWith('.html'))
        .map((file) => [`program-${file.replace('.html', '')}`, resolve(generatedProgramPagesDir, file)])
    )
  : {};

export default defineConfig({
  base: '/kirdev-studio.github.io/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        programs: resolve(__dirname, 'pages/programs.html'),
        programDetail: resolve(__dirname, 'pages/program_detail.html'),
        notFound: resolve(__dirname, 'pages/404.html'),
        ...generatedProgramPageInputs
      }
    }
  }
});
