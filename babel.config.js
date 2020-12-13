'use strict';

module.exports = {
    presets: [
        ['@babel/preset-env', {
            bugfixes: true,
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', {
            corejs: false,
            version: '^7.12.5'
        }]
    ]
};
