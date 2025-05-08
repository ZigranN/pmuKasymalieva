import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ ОБЯЗАТЕЛЬНО './', чтобы пути были относительными
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  }
});
