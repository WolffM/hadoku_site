import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://hadoku.me',
  output: 'server',
  adapter: node({
    mode: 'middleware'
  }),
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
