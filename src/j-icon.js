'use strict';
import IconNotFoundError from './not-found-error';
import {kebabCase} from './util';

const componentOptions = {
    /** @type {string[]} */
    classes: [],
    /** @type {boolean|string} */
    prefix: 'icon',
    /** @type {Object<string, Icon>} */
    icons: {}
};

function normalizePrefix(prefix, name) {
    if (typeof prefix === 'boolean') {
        return prefix ? `icon-${kebabCase(name)}` : null;
    }
    prefix = typeof prefix === 'string' ? prefix : 'icon-';
    return `${prefix}${kebabCase(name)}`;
}

/**
 * Vue Component
 * @type {FunctionalComponentOptions<JIconProps>}
 */
const jIcon = {
    name: 'JIcon',
    functional: true,
    props: {
        icon: {required: true, type: [String, Function]},
        title: {required: false, type: String, default: ''},
        width: {required: false, type: [Number, String], default: undefined},
        height: {required: false, type: [Number, String], default: undefined},
        ariaLabel: {required: false, type: String, default: undefined},
        role: {required: false, type: String, default: 'img'}
    },
    render(h, context) {
        const {icon, title, width, height, role, ariaLabel} = context.props;
        const {classes, prefix, icons} = componentOptions;

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

        const staticClass = [
            ...classes,
            normalizePrefix(prefix, iconName),
            context.data.staticClass
        ]
            .filter(value => !!value)
            .join(' ')
            .trim();

        /** @type {VNodeData} */
        const attrs = {
            staticClass,
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
export { componentOptions };

/**
 * JIcon Component Props
 * @typedef {Object} JIconProps
 * @property {string|Icon} Icon name or function that render child elements
 * @property {string} [title=''] Title element
 * @property {number|string} [width] SVG element width attribute
 * @property {number|string} [height] SVG element height attribute
 * @property {string} [ariaLabel] HTML element aria-label attribute
 * @property {string} [role='img'] HTML element role attribute
 */
