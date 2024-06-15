import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
  build: {
    outDir: 'dist', // Output directory for the production build
    assetsDir: '', // Assets directory relative to outDir
    minify: 'terser', // Minify the output files for production
    sourcemap: false, // Disable source maps for production (optional)
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
  },
});