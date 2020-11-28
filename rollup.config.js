'use strict';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginBabel from '@rollup/plugin-babel';
import {terser as pluginTerser} from 'rollup-plugin-terser';
import pkg from './package.json';

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
        pluginNodeResolve(),
        pluginCommonjs(),
        pluginBabel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled'
        }),
        pluginTerser()
    ]
};
