'use strict';
const pluginNodeResolve = require('@rollup/plugin-node-resolve')
    , pluginCommonjs = require('@rollup/plugin-commonjs')
    , pluginTypescript = require('@rollup/plugin-typescript')
    , pluginBabel = require('@rollup/plugin-babel')
    , {minify: pluginEsbuild} = require('rollup-plugin-esbuild')
    , pkg = require('./package.json');

module.exports = {
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
        pluginTypescript(),
        pluginBabel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime',
            extensions: ['.js', '.ts', '.cjs', '.mjs']
        }),
        pluginEsbuild()
    ]
};
