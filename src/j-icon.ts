'use strict';
import {h as createElement, PropType, ComponentPropsOptions, FunctionalComponent} from 'vue';
import IconNotFoundError from './not-found-error';
import {Icon} from '../index';

interface JIconProp {
    icon: string | Icon;
    title?: string;
    width?: number | string;
    height?: number | string;
    ariaLabel?: string;
    role?: string;
}

interface Preset {
    classes: string[];
    prefix: boolean | string;
    icons: Record<string, Icon>;
}

const preset: Preset = {
    classes: [],
    prefix: true,
    icons: {}
};

const jIconProp: ComponentPropsOptions<JIconProp> = {
    icon: {required: true, type: [String, Object] as PropType<string | Icon>},
    title: {required: false, type: String, default: undefined},
    width: {required: false, type: [Number, String] as PropType<undefined | number | string>, default: undefined},
    height: {required: false, type: [Number, String] as PropType<undefined | number | string>, default: undefined},
    ariaLabel: {required: false, type: String, default: undefined},
    role: {required: false, type: String, default: 'img'}
};

function findIcon(value: string | Icon): Icon {
    if (typeof value === 'string') {
        const obj = preset.icons[value];
        if (!obj) throw new IconNotFoundError(value);

        return obj;
    }

    return value;
}

function mergeClass(name: string, icon: Icon): string[] {
    const clazz = []
        , {classes, prefix} = preset;

    if (classes.length) clazz.push(...classes);

    if (typeof prefix === 'boolean') {
        prefix && clazz.push(`icon-${name}`);
    } else {
        clazz.push(`${prefix}${name}`);
    }

    if (icon.class) {
        Array.isArray(icon.class)
            ? clazz.push(...icon.class)
            : clazz.push(icon.class);
    }

    return clazz;
}

const component: FunctionalComponent<JIconProp> = (props, {attrs}) => {
    if (!props.icon) throw new Error('JIcon: You must pass in attributes for the icon parameter');

    const detail = findIcon(props.icon)
        , iconName = typeof props.icon === 'string' ? props.icon : detail.name
        , viewBox = detail.viewBox;

    if (!Array.isArray(viewBox) || viewBox.length != 4) {
        throw new Error(`JIcon: The viewBox attribute must be an array and have four elements, icon: ${iconName}`);
    }

    const [width, height] = detail.size || [viewBox[2], viewBox[3]]
        , data: Record<string, unknown> = {
        fill: 'currentColor',
        ...detail.attributes,
        ...attrs,
        class: mergeClass(iconName, detail),
        style: detail.style,
        width: props.width || width,
        height: props.height || height,
        viewBox: viewBox.join(' '),
        'aria-label': props.ariaLabel,
        'aria-hidden': (!props.ariaLabel).toString(),
        role: props.role
    };

    let children = detail.render();
    if (props.title) {
        const title = createElement('title', props.title);

        if (Array.isArray(children)) {
            children.unshift(title);
        } else {
            children = [title, children];
        }
    }

    return createElement('svg', data, children);
};

component.displayName = 'JIcon';
component.props = jIconProp;
component.inheritAttrs = true;

export default component;
export { preset };
