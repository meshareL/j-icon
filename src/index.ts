'use strict';
import {Plugin} from 'vue';
import JIcon, {preset} from './j-icon';
import {Option} from '../index';

/**
 * Vue plugin install function
 *
 * @param app vue instance
 * @param options plugin options
 */
const install: Plugin = (app, options: Option) => {
    const {
        name = JIcon.displayName!,
        classes = [],
        prefix = true,
        icons = {}
    } = options || {};

    app.component(name, JIcon);

    preset.classes = classes;
    preset.prefix = prefix;
    preset.icons = icons;
};

export default install;
