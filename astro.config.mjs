import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hadoku.me',
  output: 'static',
  vite: {
    build: {
      target: 'esnext'
    },
    server: {
      fs: {
        // Allow serving files from mf directory
        allow: ['..']
      }
    }
  }
});
