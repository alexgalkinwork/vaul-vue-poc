import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/vaul-vue-poc/',
  plugins: [vue(), tailwindcss()],
  server: { host: true }
});
