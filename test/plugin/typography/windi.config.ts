import typography from '../../../src/plugin/typography';
import { defineConfig } from '../../../src/helpers';

export default defineConfig({
  darkMode: 'media',
  plugins: [
    typography({
      rtl: false,
      dark: true,
    }),
  ],
});
