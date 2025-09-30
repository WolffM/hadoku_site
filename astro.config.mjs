import { defineConfig } from 'astro/config';

export default defineConfig({
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
