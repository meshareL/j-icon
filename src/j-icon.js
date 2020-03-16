'use strict';
import IconNotFoundError from './not-found-error';
import {kebabCase} from './util';

/** @type {string[]} */
const classNames = [];
/** @type {Object<string, Icon>} */
const icons = {};

/**
 * Vue Component
 * @type {FunctionalComponentOptions}
 */
const jIcon = {
    name: 'JIcon',
    functional: true,
    props: {
        icon: {required: true, type: [String, Function]},
        title: {required: false, type: String, default: ''},
        width: {required: false, type: [Number, String], default: undefined},
        height: {required: false, type: {Number, String}, default: undefined},
        ariaLabel: {required: false, type: String, default: undefined},
        role: {required: false, type: String, default: 'img'}
    },
    render(h, context) {
        const {icon, title, width, height, role, ariaLabel} = context.props;

        /** @type {Icon} */
        const renderFun = typeof icon === 'function' ? icon : icons[icon] || function () {throw new IconNotFoundError(icon);}();
        const iconName = typeof icon === 'string' ? icon : (renderFun.iconName || renderFun.name);

        const children = renderFun(h);
        if (!Array.isArray(children)) {
            throw new TypeError(`JIcon: The icon function must return an array, iconName: ${iconName}`);
        }

        const viewBox = renderFun.viewBox;
        if (!Array.isArray(viewBox) || viewBox.length !== 4) {
            throw new TypeError(`JIcon: The viewBox attribute must be an array and have four elements, iconName: ${iconName}`);
        }

        const [defWidth, defHeight] = renderFun.size || [viewBox[2], viewBox[3]];

        /** @type {VNodeData} */
        const attrs = {
            staticClass: `${classNames.join(' ')} icon-${kebabCase(iconName)} ${context.data.staticClass || ''}`.trim(),
            attrs: {
                ...context.data.attrs,
                width: width ? width : defWidth,
                height: height ? height : defHeight,
                viewBox: viewBox.join(' '),
                'aria-label': ariaLabel,
                'aria-hidden': (!ariaLabel).toString(),
                role
            },
            on: context.listeners
        };

        title && children.unshift(h('title', title));

        return h('svg', Object.assign({}, context.data, attrs), children);
    }
};

export default jIcon;
export { classNames, icons };
