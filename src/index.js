'use strict';
import jIcon, {componentOptions} from './j-icon';

/**
 * Vue plugin install function
 *
 * @param {VueConstructor} vue constructor
 * @param {PluginOption} options plugin options
 */
function install(vue, options) {
    const {
        name = jIcon.name,
        classNames = [],
        prefix = true,
        icons = {}
    } = options || {};

    vue.component(name, jIcon);

    componentOptions.classes = classNames;
    componentOptions.prefix = prefix;
    componentOptions.icons = icons;
}

export default install;

/**
 * @typedef {Object} PluginOption
 * @property {string} [name] Component name
 * @property {string[]} [classNames] SVG class attribute
 * @property {boolean|string} [prefix] Icon name class prefix
 * @property {Object<string, Icon>} [icons] Element render function
 */
