import { addHook } from 'pirates';
import { resolve } from 'path';

export function convert(code: string): string {
  const map = {
    '@tailwindcss\\/typography': 'windicss/plugin/typography',
    '@tailwindcss\\/forms': 'windicss/plugin/forms',
    '@tailwindcss\\/aspect-ratio': 'windicss/plugin/aspect-ratio',
    '@tailwindcss\\/line-clamp': 'windicss/plugin/line-clamp',
    'tailwindcss\\/plugin': 'windicss/plugin',
    'tailwindcss\\/colors': 'windicss/colors',
    'tailwindcss\\/resolveConfig': 'windicss/resolveConfig',
    'tailwindcss\\/defaultConfig': 'windicss/defaultConfig',
    'tailwindcss\\/defaultTheme': 'windicss/defaultTheme',
  };
  for (const [key, value] of Object.entries(map)) {
    code = code.replace(new RegExp(key, 'g'), value);
  }
  return code;
}

export function transform(path: string): string {
  const matcher = (filename: string) => true;
  const revert = addHook(
    (code, filename) => matcher(filename) ? convert(code) : code,
    { exts: ['.js'], matcher }
  );
  const mod = require(resolve(path));
  revert();
  return mod;
}
