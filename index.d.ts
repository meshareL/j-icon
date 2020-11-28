import {CreateElement, VNode, PluginFunction} from 'vue';

/**
 * @deprecated 推荐使用 {@link IconObject} 类型
 */
interface IconFunction<V, W, H> {
    (h: CreateElement): VNode[];
    iconName?: string;
    viewBox: V;
    size?: [W, H];
    class?: string | string[];
    style?: string | Record<string, string>;
    attributes?: Record<string, string>;
}

interface IconObject<V, W, H> {
    /** 图标名称 */
    name: string;
    /**
     * SVG 元素 viewBox 属性
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox viewBox
     */
    viewBox: V;
    /** SVG 元素 width, height 属性. 如果该属性为空, 将使用 viewBox 属性 */
    size?: [W, H];
    /** SVG 元素 class */
    class?: string | string[];
    /** SVG 元素 style */
    style?: string | Record<string, string>;
    /** SVG 元素其他属性, 不包含 viewBox, width, height 属性 */
    attributes?: Record<string, string>;
    /** 子节点渲染函数 */
    render: (h: CreateElement) => VNode[];
}

declare type Icon<
    V extends Array<number> = [number, number, number, number],
    W extends number = number,
    H extends number = number
    > = IconObject<V, W, H> | IconFunction<V, W, H>;

interface Option {
    /** 组件名称 */
    name?: string;
    /**
     * 渲染 SVG 元素时, 默认添加的 class
     *
     * @deprecated 请使用 {@link classes} 选项
     */
    classNames?: string[];
    /** 渲染 SVG 元素时, 默认添加的 class */
    classes?: string;
    /**
     * 图标名称前缀
     *
     * 如果为 false, 则不会添加具有图标名称的 class
     * 如果为 true, 则添加 icon- 前缀
     *
     * @example
     * Vue.use(JIcon, {prefix: 'j-icon-'})
     *
     * <j-icon icon="x"/>
     *
     * <svg class="j-icon-x">...</svg>
     *
     * @default true
     */
    prefix?: boolean | string;
    /**
     * 所有图标, 可直接使用图标名称渲染该对象的元素
     *
     * @example
     * <j-icon icon="x"/>
     */
    icons?: Record<string, Icon>;
}

declare const install: PluginFunction<Option>;

export default install;
export { Icon, Option };
