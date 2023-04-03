'use strict';
const pkg = require('./package.json');

module.exports = {
    presets: [
        ['@babel/preset-env', {
            // debug: true,
            bugfixes: true,
            useBuiltIns: false
        }],
        ['@babel/preset-typescript', {
            allowDeclareFields: true,
            optimizeConstEnums: true,
            onlyRemoveTypeImports: true
        }]
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', {
            corejs: false,
            version: pkg.devDependencies['@babel/runtime']
        }],
        ['babel-plugin-polyfill-corejs3', {
            // debug: true,
            method: 'usage-pure',
            version: pkg.devDependencies['core-js-pure'],
            proposals: true
        }]
    ]
};
