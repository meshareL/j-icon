import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default defineConfig([
    {
        input: 'src/component/index.ts',
        output: [
            {
                file: 'dist/component/index.esm.js',
                format: 'module',
                sourcemap: true
            },
            {
                file: 'dist/component/index.esm.min.js',
                format: 'module',
                sourcemap: true,
                plugins: [ terser() ]
            },
            {
                name: 'JIcon',
                file: 'dist/component/index.umd.js',
                exports: 'named',
                format: 'umd',
                sourcemap: true,
                globals: { vue: 'Vue' }
            },
            {
                name: 'JIcon',
                file: 'dist/component/index.umd.min.js',
                exports: 'named',
                format: 'umd',
                sourcemap: true,
                globals: { vue: 'Vue' },
                plugins: [ terser() ]
            }
        ],
        external: [ 'vue' ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript({ noForceEmit: true, tsconfig: 'src/component/tsconfig.json' }),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: [ '.js', '.ts', '.cjs', '.mjs' ]
            })
        ]
    },
    {
        input: 'src/cli/parse.ts',
        output: [
            {
                file: 'dist/cli/parse.js',
                format: 'commonjs',
                sourcemap: true,
                exports: 'auto'
            },
            {
                file: 'dist/cli/parse.esm.js',
                format: 'esm',
                sourcemap: true
            }
        ],
        external: [
            'node:fs',
            'node:path',
            'camelcase',
            'happy-dom',
            'svgo',
            'js-beautify',
            'chalk'
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript({ noForceEmit: true, tsconfig: 'src/cli/tsconfig.json' }),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: [ '.js', '.ts', '.cjs', '.mjs' ]
            }),
            terser()
        ]
    },
    {
        input: 'src/cli/index.ts',
        output: {
            file: 'dist/cli/command.js',
            format: 'commonjs',
            sourcemap: true
        },
        external: [
            'node:fs',
            'node:path',
            'node:url',
            'node:process',
            'camelcase',
            'happy-dom',
            'svgo',
            'js-beautify',
            'chalk',
            'commander'
        ],
        plugins: [
            commonjs(),
            typescript({ noForceEmit: true, tsconfig: 'src/cli/tsconfig.json' }),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: [ '.js', '.ts', '.cjs', '.mjs' ]
            }),
            terser()
        ]
    }
]);
