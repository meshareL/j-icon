'use strict';
import { h as createElement } from 'vue';
import type { PropType, ComponentPropsOptions, FunctionalComponent } from 'vue';
import IconNotFoundError from './not-found-error';
import type { Icon, _Prop } from '../index';

interface Preset {
    classes: string[];
    prefix: boolean | string;
    icons: Record<string, Icon>;
}

const preset: Preset = {
    classes: [],
    prefix: false,
    icons: {}
}
    , jIconProp: ComponentPropsOptions<_Prop> = {
    icon: {required: true, type: [String, Object] as PropType<string | Icon>},
    width: {required: false, type: [Number, String] as PropType<number | string>},
    height: {required: false, type: [Number, String] as PropType<number | string>},
    tabindex: {required: false, type: [Number, String] as PropType<number | string>},
    title: {required: false, type: String},
    ariaLabel: {required: false, type: String},
    desc: {required: false, type: String},
    ariaDescription: {required: false, type: String}
};

function generateId(): string {
    return new Date().getTime().toString(16) + Math.random().toString(16).substring(2);
}

function findIcon(value: string | Icon): Icon {
    if (typeof value === 'string') {
        const obj = preset.icons[value];
        if (!obj) {
            throw new IconNotFoundError(value);
        }

        return obj;
    }

    return value;
}

function mergeClass(name: string): string[] {
    const clazz = []
        , {classes, prefix} = preset;

    if (classes.length) {
        clazz.push(...classes);
    }

    if (typeof prefix === 'string') {
        clazz.push(`${prefix}${name}`);
    } else {
        if (prefix) {
            clazz.push(`icon-${name}`);
        } else {
            clazz.push(name);
        }
    }

    return clazz;
}

const component: FunctionalComponent<_Prop> = (props) => {
    if (!props.icon) throw new Error('JIcon: You must pass in attributes for the icon parameter');

    const detail = findIcon(props.icon)
        , iconName = typeof props.icon === 'string' ? props.icon : detail.name
        , viewBox = detail.viewBox;

    if (!Array.isArray(viewBox) || viewBox.length != 4) {
        throw new Error(`JIcon: The viewBox attribute must be an array and have four elements, icon: ${iconName}`);
    }

    const [width, height] = detail.size || [viewBox[2], viewBox[3]]
        , data: Record<string, unknown> = {
        ...detail.attributes,
        class: mergeClass(iconName),
        width: props.width || width,
        height: props.height || height,
        viewBox: viewBox.join(' '),
        role: 'img'
    };

    let children = detail.render();
    if (!Array.isArray(children)) {
        children = [children];
    }

    let elementId = undefined
      , ariaHidden = true;
    if (props.desc) {
        ariaHidden = false;
        elementId = generateId();

        const id = elementId + '_desc'
        children.unshift(createElement('desc', {id},  props.desc));
        Reflect.set(data, 'aria-describedby', id);

    } else if (props.ariaDescription) {
        ariaHidden = false;
        Reflect.set(data, 'aria-description', props.ariaDescription);
    }

    if (props.title) {
        ariaHidden = false;
        elementId ??= generateId();

        const id = elementId + '_title';
        children.unshift(createElement('title', {id}, props.title));
        Reflect.set(data, 'aria-labelledby', id);

    } else if (props.ariaLabel) {
        ariaHidden = false;
        Reflect.set(data, 'aria-label', props.ariaLabel);
    }

    let tabindex = undefined;
    if (props.tabindex !== null && props.tabindex !== undefined) {
        if (typeof props.tabindex === 'string') {
            const value = Number.parseInt(props.tabindex, 10);
            if (!Number.isNaN(value)) {
                tabindex = value;
            }
        } else {
            if (!Number.isNaN(props.tabindex)) {
                tabindex = props.tabindex;
            }
        }
    }

    Reflect.set(data, 'tabindex', tabindex);
    if (tabindex !== undefined && tabindex >= 0) {
        ariaHidden = false;
    }

    Reflect.set(data, 'aria-hidden', String(ariaHidden));

    return createElement('svg', data, children);
};

component.displayName = 'JIcon';
component.inheritAttrs = true;
component.props = jIconProp;

export default component;
export { preset };
