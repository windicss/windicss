import fs from 'fs'
import path from 'path'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const output_dir = './dist';

const is_publish = !!process.env.PUBLISH;

const ts_plugin = is_publish
    ? typescript({
        target: "es5",
        include: 'src/**',
        outDir: output_dir,
        typescript: require('typescript')
    })
    : sucrase({
        transforms: ['typescript']
    });

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
];

const dump = (file) => path.join(output_dir, file);

const copy = (files) => files.forEach( file => fs.copyFileSync(file, dump(file)) );

const rmdir = (dir) => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)

        if (files.length > 0) {
            files.forEach(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    rmdir(dir + "/" + file)
                } else {
                    fs.unlinkSync(path.join(dir, file))
                }
            })
        };
    };
}

const mkdir = (dir) => !(fs.existsSync(dir) && fs.statSync(dir).isDirectory()) && fs.mkdirSync(dir);

const types = (src = '../types/index', dest = 'index') => {
    return {
        writeBundle() {
            fs.writeFileSync(dump(dest), `export * from '${src}';`)
        }
    }
}

export default [
    // main
    {
        input: 'src/index.ts',
        output: [
            {
                file: dump(pkg.main),
                format: 'cjs',
            },
            {
                file: dump(pkg.module),
                format: 'esm',
            }
        ],
        plugins: [
            rmdir(output_dir),
            mkdir(output_dir),
            ts_plugin,
            resolve(),
            copy(['package.json', 'README.md', 'LICENSE']),
            types('./types/index', 'index.d.ts'),
        ],
    },

    // colors
    {
        input: 'src/colors.ts',
        output: [
            {
                file: dump('colors.js'),
                format: 'cjs',
            },
            {
                file: dump('colors.mjs'),
                format: 'esm',
            }
        ],
        plugins: [
            ts_plugin,
            types('./types/colors', 'colors.d.ts'),
        ]
    },

    // cli
    {
        input: 'src/cli/index.ts',
        output: [
            {
                file: dump('cli/index.js'),
                banner: '#!/usr/bin/env node',
                format: 'cjs',
            },
            {
                file: dump('cli/index.mjs'),
                banner: '#!/usr/bin/env node',
                format: 'esm',
            },
        ],
        external,
        plugins: [
            replace({
                __NAME__: pkg.name,
                __VERSION__: pkg.version
            }),
            ts_plugin,
            resolve(),
            types('../types/cli/index', 'cli/index.d.ts'),
        ]
    },

    // utils
    ...fs.readdirSync('src/')
    .filter(dir => dir !== 'cli' && fs.statSync(`src/${dir}`).isDirectory())
    .map(dir => ({
        input: `src/${dir}/index.ts`,
        output: [
            {
                file: dump(`${dir}/index.js`),
                format: 'cjs',
            },
            {
                file: dump(`${dir}/index.mjs`),
                format: 'esm',
            }
        ],
        plugins: [
            ts_plugin,
            resolve(),
            types(`../types/${dir}/index`, `${dir}/index.d.ts`),
        ]
    })),

    // utils deep
    ...fs.readdirSync('src/utils')
    .filter(dir => dir !== 'algorithm' && fs.statSync(`src/utils/${dir}`).isDirectory())
    .map(dir => ({
        input: `src/utils/${dir}/index.ts`,
        output: [
            {
                file: dump(`utils/${dir}/index.js`),
                format: 'cjs',
            },
            {
                file: dump(`utils/${dir}/index.mjs`),
                format: 'esm',
            }
        ],
        plugins: [
            ts_plugin,
            resolve(),
            types(`../../types/utils/${dir}/index`, `utils/${dir}/index.d.ts`),
        ]
    })),
]
    