import { defineConfig } from 'vite';
import { resolve } from 'node:path';

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
        notFound: resolve(__dirname, 'pages/404.html')
      }
    }
  }
});
