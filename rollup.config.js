'use strict';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginTs from '@rollup/plugin-typescript';
import pluginBabel from '@rollup/plugin-babel';
import {terser as pluginTerser} from 'rollup-plugin-terser';
import pkg from './package.json';

process.env.NODE_ENV = 'production';

export default {
    input: './src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true
        },
        {
            name: 'JIcon',
            file: pkg.main,
            format: 'umd',
            sourcemap: true,
            globals: {vue: 'Vue'}
        }
    ],
    external: ['vue'],
    plugins: [
        pluginNodeResolve(),
        pluginCommonjs(),
        pluginTs(),
        pluginBabel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
        }),
        pluginTerser()
    ]
};
