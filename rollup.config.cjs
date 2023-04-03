const { defineConfig } = require('rollup')
    , nodeResolve = require('@rollup/plugin-node-resolve')
    , commonjs = require('@rollup/plugin-commonjs')
    , typescript = require('@rollup/plugin-typescript')
    , babel = require('@rollup/plugin-babel')
    , terser = require('@rollup/plugin-terser')
    , pkg = require('./package.json');

module.exports = defineConfig({
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'module',
            sourcemap: true
        },
        {
            file: 'dist/index.esm.min.js',
            format: 'module',
            sourcemap: true,
            plugins: [ terser() ]
        },
        {
            name: 'JIcon',
            file: pkg.main,
            exports: 'named',
            format: 'umd',
            sourcemap: true,
            globals: { vue: 'Vue' }
        },
        {
            name: 'JIcon',
            file: 'dist/index.umd.min.js',
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
        typescript(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime',
            extensions: ['.js', '.ts', '.cjs', '.mjs']
        })
    ]
});
