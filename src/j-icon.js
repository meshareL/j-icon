'use strict';
import IconNotFoundError from './not-found-error';
import {toObject} from './util';

const preset = {
    /** @type {string[]} */
    classes: [],
    /** @type {boolean|string} */
    prefix: true,
    /** @type {Object<string, IconObject>} */
    icons: {}
};

function findIcon(value) {
    if (typeof value === 'string') {
        const obj = preset.icons[value];
        if (!obj) throw new IconNotFoundError(value);

        return obj;
    }

    if (typeof value === 'function') {
        return toObject(value);
    }

    return value;
}

function mergeClass(name, ...values) {
    const clazz = []
        , {classes, prefix} = preset;

    if (classes.length) clazz.push(...classes);

    if (typeof prefix == 'boolean') {
        prefix && clazz.push(`icon-${name}`);
    } else {
        clazz.push(`${prefix}${name}`);
    }

    clazz.push(...values.flat(Number.POSITIVE_INFINITY));

    return clazz.filter(val => !!val).map(val => val.trim());
}

function mergeStyle({style}, staticStyle) {
    if (!style) return staticStyle;

    if (typeof style === 'string') {
        style = style
            .split(';')
            .map(value => value.split(':'))
            .filter(value => value.length === 2)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
    }

    return staticStyle ? Object.assign({}, style, staticStyle) : style;
}

/**
 * Vue component
 * @type {FunctionalComponentOptions<JIconProps>}
 */
const component = {
    name: 'JIcon',
    functional: true,
    props: {
        icon: {required: true, type: [String, Function, Object]},
        title: {required: false, type: String, default: ''},
        width: {required: false, type: [Number, String], default: undefined},
        height: {required: false, type: [Number, String], default: undefined},
        ariaLabel: {required: false, type: String, default: undefined},
        role: {required: false, type: String, default: 'img'}
    },
    render(h, context) {
        const {icon, title, width, height, ariaLabel, role} = context.props;

        const detail = findIcon(icon)
            , iconName = typeof icon === 'string' ? icon : detail.name
            , viewBox = detail.viewBox;

        if (!Array.isArray(viewBox) || viewBox.length !== 4) {
            throw new Error(`JIcon: The viewBox attribute must be an array and have four elements, icon: ${iconName}`);
        }

        const children = detail.render(h);
        if (!Array.isArray(children)) {
            throw new Error(`JIcon: The icon render function must return an array, icon: ${iconName}`);
        }

        if (title) children.unshift(h('title', title));

        const [defWidth, defHeight] = detail.size || [viewBox[2], viewBox[3]]
        /** @type {VNodeData} */
        const attrs = {
            staticClass: mergeClass(iconName, detail.class, context.data.staticClass).join(' '),
            staticStyle: mergeStyle(icon, context.data.staticStyle),
            attrs: {
                ...context.data.attrs,
                viewBox: viewBox.join(' '),
                width: width ?? defWidth,
                height: height ?? defHeight,
                'aria-label': ariaLabel,
                'aria-hidden': (!ariaLabel).toString(),
                role
            },
            on: context.listeners
        };

        return h('svg', Object.assign({}, context.data, attrs), children);
    }
};

export default component;
export { preset };

/**
 * JIcon Component Props
 *
 * @typedef {Object} JIconProps
 * @property {string|Icon} icon Icon name, icon render function or icon object
 * @property {string} [title=''] Title element
 * @property {number|string} [width] SVG element width attribute
 * @property {number|string} [height] SVG element height attribute
 * @property {string} [ariaLabel] HTML element aria-label attribute
 * @property {string} [role='img'] HTML element role attribute
 */
