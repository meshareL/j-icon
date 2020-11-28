'use strict';

module.exports = {
    mode: 'production',
    devtool: 'eval',
    performance: { hints: false },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true }
                    }
                ]
            }
        ]
    }
};
