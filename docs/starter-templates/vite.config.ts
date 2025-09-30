import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    // Local dev base path (change 'myapp' to your app name)
    base: command === 'serve' ? '/myapp/' : undefined,
    
    plugins: [react()],
    
    server: {
      port: 5173,
      open: '/myapp/',
    },
    
    build: {
      // Enable source maps for debugging
      sourcemap: true,
      
      // Build as a library (not a standalone app)
      lib: {
        entry: 'src/entry.tsx',
        formats: ['es'],              // ES modules only
        fileName: () => 'index.js',   // Output: dist/index.js
      },
      
      // External dependencies (provided by parent via import maps)
      rollupOptions: {
        external: ['react', 'react-dom/client'],
      },
    },
  };
});
