import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';
import svelte from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    WindiCSS(),
    svelte({
      extensions: ['.svelte', '.mdx'],
      preprocess: mdsvex({
        extension: '.mdx',
      }),
    }),
  ],
});
