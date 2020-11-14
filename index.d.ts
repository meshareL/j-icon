import {VNode, VNodeArrayChildren, Plugin} from 'vue';

interface Icon<
    V extends Array<number> = [number, number, number, number],
    W extends number = number,
    H extends number = number> {

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
    render: () => VNode | VNodeArrayChildren;
}

interface Option {
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
     * @default true
     */
    prefix?: string | boolean;
    /**
     * 所有图标, 可直接使用图标名称渲染该对象的元素
     *
     * @example
     * <j-icon icon="x"/>
     */
    icons?: Record<string, Icon>;
}

/**
 * 插件安装函数
 *
 * @see Option 插件选项
 */
declare const install: Plugin;

export default install;
export { Icon, Option };
