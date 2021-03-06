import { addHook } from 'pirates';

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

export function transform(path: string): any {
  const matcher = (filename: string) => !/\/windicss\//.test(filename);
  const revert = addHook(
    (code, ) => convert(code),
    { exts: ['.js'], matcher, ignoreNodeModules: false }
  );
  const mod = require(path);
  revert();
  return mod;
}
