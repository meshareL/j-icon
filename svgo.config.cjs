// 使用 .js 扩展名可能会意外导致 jest 开启 ECMAScript Modules 支持导致启动失败
// @see svgo/lib/svgo-node.js importConfig
/** @type import('svgo').Config */
module.exports = {
    multipass: true,
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    removeViewBox: false,
                    sortAttrs: false
                }
            }
        },
        'removeXMLNS',
        'convertStyleToAttrs',
        'removeStyleElement',
        'removeScriptElement',
        { name: 'removeAttrs', params: { attrs: [ 'data-.*' ] } }
    ]
};
