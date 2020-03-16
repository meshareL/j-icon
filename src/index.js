'use strict';
import jIcon, {classNames as iClassNames, icons as iIcons} from './j-icon';

/**
 * Vue plugin install function
 *
 * @param {VueConstructor} vue constructor
 * @param {PluginOption} options plugin options
 */
function install(vue, options = {name: jIcon.name, classNames: [], icons: {}}) {
    const {name, classNames, icons} = options;

    vue.component(name, jIcon);

    iClassNames.push(...classNames);

    for (const name in icons) {
        if (icons.hasOwnProperty(name)) {
            iIcons[name] = icons[name];
        }
    }
}

export default install;

/**
 * @typedef {Object} PluginOption
 * @property {string} [name] component name
 * @property {string[]} [classNames] the svg class attribute
 * @property {Object<string, Icon>} [icons] svg render
 */
