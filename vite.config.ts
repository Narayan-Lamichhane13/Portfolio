import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo at https://<user>.github.io/Portfolio/, so
// production builds need a non-root base path. Local dev keeps "/" so HMR,
// links, and asset URLs all work as expected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Portfolio/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          motion: ['framer-motion'],
        },
      },
    },
  },
}));
