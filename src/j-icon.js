'use strict';
import IconNotFoundError from './not-found-error';
import {startWith} from './util';

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
        const {icon, title, width, height, role, ariaLabel} = context.props
            , renderFun = typeof icon === 'function' ? icon : icons[icon] || function () {throw new IconNotFoundError(icon);}()
            , children = renderFun(h)
            , [defWidth, defHeight] = renderFun.size
            , viewBox = renderFun.viewBox;

        let iconName = renderFun.name.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`);
        iconName = startWith(iconName, '-') ? iconName : `-${iconName}`;

        /** @type {VNodeData} */
        const attrs = {
            staticClass: `${classNames.join(' ')} icon${iconName} ${context.data.staticClass || ''}`.trim(),
            attrs: {
                ...context.data.attrs,
                width: width ? width : defWidth,
                height: height ? height : defHeight,
                viewBox: viewBox ? viewBox.join(' ') : `0 0 ${defWidth} ${defHeight}`,
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
