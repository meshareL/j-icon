import { VNode, Plugin, FunctionalComponent, SVGAttributes } from 'vue';
import type { KebabCasedProperties } from 'type-fest';

type Icon<W extends number = number, H extends number = number> = {
    /** 图标名称 */
    name: string;
    /**
     * SVG 元素 viewBox 属性
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox viewBox
     */
    viewBox: [number, number, number, number];
    /** SVG 元素 width, height 属性. 如果该属性为空, 将使用 viewBox 属性 */
    size?: [W, H];
    /** SVG 元素其他属性, 不包含 viewBox, width, height 属性 */
    attributes?: Record<string, string>;
    /** 子节点渲染函数 */
    render: () => VNode | VNode[];
};

type Option = {
    /** 组件名称 */
    name?: string;
    /** 渲染 SVG 元素时, 默认添加的 class */
    classes?: string[];
    /**
     * 图标名称前缀
     *
     * 如果为 false, 则不会添加具有图标名称的 class
     * 如果为 true, 则添加 icon- 前缀
     *
     * @example
     * const app = Vue.createApp();
     * app.use(JIcon, {prefix: 'j-icon-'});
     *
     * <j-icon icon="x"/>
     * rendered
     * <svg class="j-icon-x">...</svg>
     *
     * @default false
     */
    prefix?: string | boolean;
    /**
     * 所有图标, 可直接使用图标名称渲染该对象的元素
     *
     * @example
     * <j-icon icon="x"/>
     */
    icons?: Icon[] | Record<string, Icon>;
};

type A11yProp =
    (
          { title: string; 'aria-label'?: never }
          | { title?: never; 'aria-label': string }
          | { title?: never; 'aria-label'?: never }
    )
    &
    (
          { desc: string; 'aria-description'?: never }
          | { desc?: never; 'aria-description': string }
          | { desc?: never; 'aria-description'?: never }
    );

/**
 * ariaLabel 与 title 属性不应同时使用, 如果同时提供这两种, 将优先使用 title
 * ariaDescription 与 desc 属性同理, 将会优先使用 desc
 *
 * 使用 title 与 desc 属性时, 将自动生成 id, 并通过 aria-labelledby 与
 * aria-describedby 引用元素
 */
type _Prop = {
    /** 需要渲染的图标的名称或该图标的渲染函数 */
    icon: string | Icon;
    /** SVG 元素宽度 */
    width?: number | string;
    /** SVG 元素高度 */
    height?: number | string;
    /**
     * SVG 元素是否可聚焦, 以及聚焦时的相对顺序
     *
     * @see https://www.w3.org/TR/SVG2/struct.html#tabindexattribute tabindex
     */
    tabindex?: number | string;
    /**
     * 为 SVG 元素提供一个描述性字符串, 用来提升 SVG 文档的可访问性
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title title
     */
    title?: string;
    /**
     * 为 SVG 元素添加标签描述
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute aria-label
     */
    ariaLabel?: string;
    /**
     * 为 SVG 元素提供一个长文本描述
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc desc
     */
    desc?: string;
    /**
     * 为 SVG 元素添加描述或注释
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-description aria-descript
     */
    ariaDescription?: string;
};

type Prop = SVGAttributes & KebabCasedProperties<_Prop> & A11yProp;

/**
 * 插件安装函数
 *
 * @see Option 插件选项
 */
declare const install: Plugin;
declare const component: FunctionalComponent<Prop>;

export default component;
export { install as plugin };
export type { Icon, Option, Prop, _Prop };
