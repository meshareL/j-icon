'use strict';
import pluginClear from 'rollup-plugin-clear';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginBabel from 'rollup-plugin-babel';
import {terser as pluginTerser} from 'rollup-plugin-terser';
import pkg from './package.json';

process.env.NODE_ENV = 'production';

export default {
    input: './src/index.js',
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
            sourcemap: true
        }
    ],
    plugins: [
        pluginClear({targets: ['dist']}),
        pluginNodeResolve(),
        pluginCommonjs(),
        pluginBabel({exclude: 'node_modules/**'}),
        pluginTerser()
    ]
};