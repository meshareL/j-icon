import pkg from './package.json' assert { type: 'json' };

export default {
    browserslistEnv: 'browser',
    presets: [
        [ '@babel/preset-env', {
            // debug: true,
            bugfixes: true,
            useBuiltIns: false
        }],
        [ '@babel/preset-typescript', {
            allowDeclareFields: true,
            optimizeConstEnums: true,
            onlyRemoveTypeImports: true
        }]
    ],
    plugins: [
        [ '@babel/plugin-transform-runtime', {
            corejs: false,
            version: pkg.dependencies['@babel/runtime']
        }],
        [ 'babel-plugin-polyfill-corejs3', {
            // debug: true,
            // exclude: [ 'es.array.push', 'es.array.unshift' ],
            method: 'usage-pure',
            version: pkg.dependencies['core-js-pure'],
            proposals: true
        }]
    ],
    overrides: [{
        test: 'src/cli/**/*',
        browserslistEnv: 'node'
    }]
};
