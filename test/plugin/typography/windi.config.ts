import typography from '../../../src/plugin/typography';
import { defineConfig } from '../../../src/helpers';

export default defineConfig({
  darkMode: 'class',
  plugins: [
    typography({
      rtl: true,
      dark: true,
    }),
  ],
});
