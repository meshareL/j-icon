'use strict';
import jIcon, {preset} from './j-icon';
import {toObject} from './util';

/**
 * Vue plugin install function
 *
 * @param {VueConstructor} vue constructor
 * @param {Option} options plugin options
 */
function install(vue, options) {
    const {
        name = jIcon.name,
        classNames,
        classes = [],
        prefix = true,
        icons = {}
    } = options || {};

    if (classNames) classes.push(...classNames);

    const processed = Object.entries(icons).reduce((obj, [name, icon]) => {
        obj[name] = typeof icon === 'function' ? toObject(icon, name) : icon;
        return obj;
    }, {});

    vue.component(name, jIcon);
    preset.classes = classes;
    preset.prefix = prefix;
    preset.icons = processed;
}

export default install;

/**
 * @deprecated
 * @typedef {Object} Option
 * @property {string} [name] Component name
 * @property {string[]} [classNames] SVG class attribute
 * @property {string[]} [classes] SVG class attribute
 * @property {boolean|string} [prefix] Icon name class prefix
 * @property {Object<string, Icon>} [icons] Element render function
 */
