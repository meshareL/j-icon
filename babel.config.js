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
            allowDeclareFields: true
        }]
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', {
            corejs: 3,
            version: pkg.dependencies['@babel/runtime-corejs3']
        }]
    ]
};
