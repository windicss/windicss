import fs from 'fs'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const output_dir = './dist';

const ts_plugin = typescript({
    target: "es5",
    include: 'src/**',
    outDir: output_dir,
    typescript: require('typescript')
});

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
];

const dump = (path) => `${output_dir}/${path}`;

const copy = (files) => files.forEach( file => fs.copyFileSync(file, dump(file)) );

const rmdir = (path) => {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path)

        if (files.length > 0) {
            files.forEach(filename => {
                if (fs.statSync(path + "/" + filename).isDirectory()) {
                    rmdir(path + "/" + filename)
                } else {
                    fs.unlinkSync(path + "/" + filename)
                }
            })
        };
    };
}

const mkdir = (path) => !(fs.existsSync(path) && fs.statSync(path).isDirectory()) && fs.mkdirSync(path);

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
            copy(['package.json', 'README.md', 'LICENSE'])
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
            ts_plugin
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
        ]
    })),
]
    