'use strict';
import pluginJson from '@rollup/plugin-json';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginTs from '@rollup/plugin-typescript';
import pluginBabel from '@rollup/plugin-babel';
import {terser as pluginTerser} from 'rollup-plugin-terser';
import pkg from './package.json';

const external = [
    'fs',
    'path',
    'camelcase',
    'js-yaml',
    'jsdom',
    'svgo',
    'js-beautify',
    'terser',
    'chalk',
    'commander',
    /@babel\/runtime/
];

export default [
    {
        input: './src/execute.ts',
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
            pluginTs(),
            pluginBabel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
            }),
            pluginTerser()
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
            pluginTs(),
            pluginBabel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
            }),
            pluginTerser()
        ]
    }
];
