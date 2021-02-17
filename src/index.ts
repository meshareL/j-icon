'use strict';
import {Plugin} from 'vue';
import JIcon, {preset} from './j-icon';
import {Icon, Option} from '../index';

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

    let processed;
    if (Array.isArray(icons)) {
        processed = icons.reduce<Record<string, Icon>>((obj, icon) => {
            obj[icon.name] = icon;
            return obj;
        }, {});
    } else {
        processed = icons;
    }

    preset.classes = classes;
    preset.prefix = prefix;
    preset.icons = processed;
};

export default install;
export { JIcon };
