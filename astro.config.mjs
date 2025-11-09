import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://hadoku.me',
  output: 'static',
  integrations: [tailwind(), react()],
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
