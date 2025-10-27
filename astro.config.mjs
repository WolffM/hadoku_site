import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://hadoku.me',
  output: 'static',
  integrations: [tailwind()],
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
