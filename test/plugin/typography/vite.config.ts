import { defineConfig } from 'vite';
import windi from 'vite-plugin-windicss';
import markdown from 'vite-plugin-md';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    windi(),
    markdown(),
  ],
});
