import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Base path configurable: VITE_BASE=/mi-repo/ npm run build (GitHub Pages)
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        escritorio: resolve(__dirname, 'escritorio/index.html'),
        movil: resolve(__dirname, 'movil/index.html'),
        profe: resolve(__dirname, 'profe/index.html'),
      },
    },
  },
});
