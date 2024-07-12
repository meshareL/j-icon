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
                file: 'dist/component/index.esm.min.js',
                format: 'module',
                sourcemap: true
            },
            {
                name: 'JIcon',
                file: 'dist/component/index.umd.min.js',
                exports: 'named',
                format: 'umd',
                sourcemap: true,
                globals: { vue: 'Vue' }
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
            }),
            terser()
        ]
    },
    {
        input: 'src/cli/index.ts',
        output: {
            file: 'dist/cli/command.js',
            format: 'module',
            sourcemap: true
        },
        external: [
            /node:/,
            /core-js-pure/,
            'camelcase',
            'happy-dom',
            'svgo',
            'prettier',
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
