import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // <-- исправили на абсолютный путь
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
