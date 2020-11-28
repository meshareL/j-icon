'use strict';
/**
 * 将渲染函数转换为对象
 *
 * @param {IconFunction} fun 图标函数
 * @param {string} [name] 图标名称
 */
function toObject(fun, name) {
    return {
        name: name ?? fun.iconName ?? fun.name,
        viewBox: fun.viewBox,
        size: fun.size,
        class: fun.class,
        style: fun.style,
        attributes: fun.attributes,
        render: fun
    };
}

export { toObject };
