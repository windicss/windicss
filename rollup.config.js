import fs from 'fs';
import path from 'path';
import dts from 'rollup-plugin-dts';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const output_dir = './dist';

const prod = process.env.NODE_ENV === 'production';

const ts_plugin = prod
  ? typescript({
    target: 'es5',
    include: 'src/**',
    outDir: output_dir,
    typescript: require('typescript'),
  })
  : sucrase({
    exclude: ['node_modules/**'],
    transforms: ['typescript'],
  });

const dump = (file) => path.join(output_dir, file);

const copy = (files) => files.forEach((file) => fs.copyFileSync(file, dump(file)));

const rmdir = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);

    if (files.length > 0) {
      files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          rmdir(dir + '/' + file);
        } else {
          fs.unlinkSync(path.join(dir, file));
        }
      });
    }
  }
};

const mkdir = (dir) => !(fs.existsSync(dir) && fs.statSync(dir).isDirectory()) && fs.mkdirSync(dir);

const pack = (dir, mjs = true) => {
  return {
    writeBundle() {
      fs.writeFileSync(
        `${dump(dir)}/package.json`,
        JSON.stringify(
          {
            main: './index.js',
            module: './index.mjs',
            types: './index.d.ts',
          },
          null,
          '  '
        )
      );
    },
  };
};

const types = [
  'index.ts',
  'colors.ts',
  'defaultConfig.ts',
  'defaultTheme.ts',
  'config/index.ts',
  'lib/index.ts',
  'plugin/index.ts',
  ...fs.readdirSync('src/plugin').filter(dir => fs.statSync(`src/plugin/${dir}`).isDirectory()).map(dir => `plugin/${dir}/index.ts`),
  'utils/index.ts',
  ...fs.readdirSync('src/utils').filter(dir => dir !== 'algorithm' && fs.statSync(`src/utils/${dir}`).isDirectory()).map(dir => `utils/${dir}/index.ts`),
]

export default [
  // main
  {
    input: 'src/index.ts',
    output: [
      {
        file: dump('index.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('index.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      rmdir(output_dir),
      mkdir(output_dir),
      copy(['package.json', 'README.md', 'LICENSE']),
    ],
  },

  // colors
  {
    input: 'src/colors.ts',
    output: [
      {
        file: dump('colors.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('colors.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
    ],
  },

  // defaultConfig
  {
    input: 'src/defaultConfig.ts',
    output: [
      {
        file: dump('defaultConfig.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('defaultConfig.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
    ],
  },

  // defaultTheme
  {
    input: 'src/defaultTheme.ts',
    output: [
      {
        file: dump('defaultTheme.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('defaultTheme.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin
    ],
  },

  // plugin
  {
    input: 'src/plugin/index.ts',
    output: [
      {
        file: dump('plugin/index.js'),
        exports: 'default',
        format: 'cjs',
      },
      {
        file: dump('plugin/index.mjs'),
        format: 'esm',
      },
    ],
    plugins: [
      ts_plugin,
      resolve(),
      pack('plugin'),
    ],
  },

  // plugin deep
  ...fs.readdirSync('src/plugin')
    .filter(
      (dir) => fs.statSync(`src/plugin/${dir}`).isDirectory()
    )
    .map((dir) => ({
      input: `src/plugin/${dir}/index.ts`,
      output: [
        {
          file: dump(`plugin/${dir}/index.js`),
          exports: 'default',
          format: 'cjs',
        },
      ],
      plugins: [
        ts_plugin,
        resolve(),
        commonjs(),
      ],
    })),

  // cli
  {
    input: 'src/cli/index.ts',
    output: [
      {
        file: dump('cli/index.js'),
        banner: '#!/usr/bin/env node',
        format: 'cjs',
        paths: (id) =>
          id.match(/\/src\/(lib|utils|plugin|config|colors)/) &&
          `../${path.dirname(path.relative('./src', id))}/index.js`,
      },
    ],
    external: (id) =>
      id.match(/\/src\/(lib|utils|plugin|config|colors)/),
    plugins: [
      replace({
        __NAME__: pkg.name,
        __VERSION__: pkg.version,
      }),
      ts_plugin,
      resolve(),
      commonjs(),
    ],
  },

  // utils
  ...fs
    .readdirSync('src/')
    .filter((dir) => ['config', 'lib', 'utils'].includes(dir) && fs.statSync(`src/${dir}`).isDirectory())
    .map((dir) => ({
      input: `src/${dir}/index.ts`,
      output: [
        {
          file: dump(`${dir}/index.js`),
          format: 'cjs',
        },
        {
          file: dump(`${dir}/index.mjs`),
          format: 'esm',
        },
      ],
      plugins: [
        ts_plugin,
        json(),
        resolve(),
        commonjs(),
        pack(dir),
      ],
    })),

  // utils deep
  ...fs
    .readdirSync('src/utils')
    .filter(
      (dir) =>
        dir !== 'algorithm' && fs.statSync(`src/utils/${dir}`).isDirectory()
    )
    .map((dir) => ({
      input: `src/utils/${dir}/index.ts`,
      output: [
        {
          file: dump(`utils/${dir}/index.js`),
          format: 'cjs',
        },
        {
          file: dump(`utils/${dir}/index.mjs`),
          format: 'esm',
        },
      ],
      plugins: [
        ts_plugin,
        json(),
        resolve(),
        commonjs(),
        pack(`utils/${dir}`),
      ],
    })),

  ...types.map(entrypoint => {
    return {
      input: `src/${entrypoint}`,
      output: [
        {
          file: dump(entrypoint.replace(/.ts$/, '.d.ts')),
          format: 'es',
        },
      ],
      plugins: [
        dts(),
      ],
    }
  })
];
