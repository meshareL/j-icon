'use strict';
const {defineConfig} = require('rollup')
    , pluginJson = require('@rollup/plugin-json')
    , pluginNodeResolve = require('@rollup/plugin-node-resolve')
    , pluginCommonjs = require('@rollup/plugin-commonjs')
    , pluginTypescript = require('@rollup/plugin-typescript')
    , pluginBabel = require('@rollup/plugin-babel')
    , {minify: pluginEsbuild} = require('rollup-plugin-esbuild')
    , pkg = require('./package.json');

const external = [
    'fs',
    'path',
    'camelcase',
    'jsdom',
    'svgo',
    'js-beautify',
    'chalk',
    'commander'
];

module.exports = defineConfig([
    {
        input: './src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'commonjs',
                sourcemap: true,
                exports: 'auto'
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        external,
        plugins: [
            pluginJson(),
            pluginNodeResolve(),
            pluginCommonjs(),
            pluginTypescript(),
            pluginBabel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: ['.js', '.ts', '.cjs', '.mjs']
            }),
            pluginEsbuild()
        ]
    },
    {
        input: './src/command.ts',
        output: {
            file: 'dist/command.js',
            format: 'commonjs',
            sourcemap: true
        },
        external,
        plugins: [
            pluginJson(),
            pluginNodeResolve(),
            pluginCommonjs(),
            pluginTypescript(),
            pluginBabel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: ['.js', '.ts', '.cjs', '.mjs']
            }),
            pluginEsbuild()
        ]
    }
]);
