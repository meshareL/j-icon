'use strict';

module.exports = {
    mode: 'production',
    devtool: 'eval',
    performance: { hints: false },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.vue', '.ts'],
        alias: {
            '@vue/test-utils': '@vue/test-utils/dist/vue-test-utils.esm-bundler.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true }
                    },
                    { loader: 'ts-loader' }
                ]
            }
        ]
    }
};
