'use strict';
import beautify, {JSBeautifyOptions} from 'js-beautify';
import {minify, MinifyOptions} from 'terser';
import camelcase from 'camelcase';
import {Format, Version} from './misc';
import {exportation} from './util';

interface ProcessorProp {
    elements: Record<string, ISVGElement>;
    condense?: boolean;
    banner?: string;
}

interface ISVGElement {
    nodeName: string;
    attributes?: Record<string, string>;
    children?: ISVGElement[];
}

const beautifyOption: JSBeautifyOptions = {
    indent_char: ' ',
    indent_size: 4,
    space_in_paren: false,
    space_in_empty_paren: false,
    end_with_newline: true
}
    , minifyOption: MinifyOptions = {
    keep_classnames: false,
    keep_fnames: false,
    toplevel: true
};

/**
 * SVG 元素处理抽象类
 */
abstract class Processor {
    protected readonly _condense: boolean;
    protected readonly _elements: Record<string, ISVGElement>;

    /**
     * 构造一个 SVG 元素处理器类
     *
     * @param option
     * @param option.elements 需要处理的元素
     * @param option.condense 是否压缩代码
     */
    constructor({elements, condense = false}: ProcessorProp) {
        this._condense = condense;
        this._elements = elements;
    }

    public get elements(): Record<string, ISVGElement> {
        return this._elements;
    }

    public get isCondense(): boolean {
        return this._condense;
    }

    protected get banner(): string {
        return '/* THIS FILE IS GENERATED. DO NOT EDIT IT. */';
    }

    /**
     * 获取需要生成代码的 Vue 版本
     */
    public abstract get version(): Version;

    /**
     * 格式化给定代码
     *
     * @param code 代码
     * @param option
     * @return 格式化后的代码
     */
    protected format(code: string, option?: JSBeautifyOptions): string {
        if (!code) return '';
        return beautify(code, option ?? beautifyOption);
    }

    /**
     * 压缩给定代码
     *
     * 无法处理 Typescript 代码
     *
     * @param code 代码
     * @param option 压缩选项
     * @return 压缩后的代码
     */
    protected async condense(code: string, option?: MinifyOptions): Promise<string> {
        if (!code) return '';
        return (await minify(code, option ?? minifyOption)).code ?? '';
    }

    /**
     * 序列化对象或数组
     *
     * @param value 需要序列化的对象或数组
     * @return 序列化后的字符串
     */
    protected serialize(value: object | any[]): string {
        if (Array.isArray(value)) return value.length < 1 ? '' : `[${value.join(',')}]`;

        const text = Object.entries(value)
            .map(([key, val]) => `'${key}': '${val}'`)
            .join(',');

        return text ? `{${text}}` : '';
    }

    /**
     * 将单个子元素转换为代码字符串
     *
     * @param element 需要处理的子元素
     * @param format 代码格式
     * @return 字符串
     */
    protected abstract transformChild(element: ISVGElement, format: Format): string;

    /**
     * 将元素转换为图标对象字符串
     *
     * @param name 元素名称
     * @param element 需要处理的元素
     * @param format 代码格式
     * @return 字符串
     */
    protected transformElement(name: string, element: ISVGElement, format: Format): string {
        let {viewBox, width, height, class: clazz, style, ...attributes} = element.attributes!;
        const viewbox = viewBox.split(/\s+/).map(val => Number.parseInt(val, 10));
        width = width ?? viewbox[2];
        height = height ?? viewbox[3];

        const codes = [`name: '${name}'`, `viewBox: [${viewbox.join(', ')}]`, `size: [${width}, ${height}]`];

        if (Object.keys(attributes).length) codes.push(`attributes: ${this.serialize(attributes)}`);
        if (clazz) codes.push(`class: '${clazz}'`);
        if (style) codes.push(`style: '${style}'`);

        const suffix = format === Format.TYPESCRIPT ? `: Icon<[${viewbox.join(', ')}], ${width}, ${height}>` : '';

        return `const ${camelcase(name, {pascalCase: true})}${suffix} = {
    ${codes.join(', ')},
    render(${this.version === Version.VERSION_2 ? 'h' : ''}) {
        return [${element.children?.map(val => this.transformChild(val, format)).join(', ')}];
    }
};`;
    }

    /**
     * 生成 json
     *
     * @return json
     */
    public json(): string {
        return JSON.stringify(this.elements, null, this.isCondense ? 0 : 2);
    }

    /**
     * 生成模块代码. 该代码可压缩
     *
     * @return 原生模块代码
     */
    public module(): Promise<string> {
        const banner = this.version === Version.VERSION_3
            ? `${this.banner}\nimport {h} from 'vue';\n`
            : `${this.banner}\n`
            , code =  `${banner}
${Object.entries(this.elements).map(([key, value]) => this.transformElement(key, value, Format.MODULE)).join('\n\n')}

${exportation(this.elements)}
`;
        return this.isCondense ? this.condense(code) : Promise.resolve(this.format(code));
    }

    /**
     * 生成通用模块代码. 该代码可压缩
     *
     * @return umd 代码
     */
    public abstract universalModule(): Promise<string>;

    /**
     * 生成 Typescript 代码. 该代码无法压缩
     *
     * @return typescript 代码
     */
    public typescript(): string {
        const banner = this.version === Version.VERSION_3
            ? `${this.banner}\nimport {h} from 'vue';\nimport {Icon} from '@tomoeed/j-icon';\n`
            : `${this.banner}\nimport {Icon} from '@tomoeed/j-icon';\n`
            , code =  `${banner}
${Object.entries(this.elements).map(([key, value]) => this.transformElement(key, value, Format.TYPESCRIPT)).join('\n\n')}

${exportation(this.elements)}
`;

        return this.format(code);
    }

    /**
     * 生成类型代码 (d.ts)
     *
     * @return 类型代码
     */
    public declare(): string {
        const type = (attribute: Record<string, string>) => {
            const viewBox = attribute.viewBox.split(/\s+/).map(val => Number.parseInt(val, 10))
                , width = attribute.width ?? viewBox[2]
                , height = attribute.height ?? viewBox[3];
            return `Icon<[${viewBox.join(', ')}], ${width}, ${height}>`;
        }

        return  `${this.banner}
import {Icon} from '@tomoeed/j-icon';

${Object.entries(this.elements)
            .map(([key, value]) => `declare const ${camelcase(key, {pascalCase: true})}: ${type(value.attributes!)}`)
            .join(';\n')};

type Icons = {
    ${Object.entries(this.elements)
            .map(([key, value]) => `'${key}': ${type(value.attributes!)}`)
            .join(`,\n${' '.repeat(4)}`)}
};

declare const icons: Icons;

export default icons;
export {
    ${Object.keys(this.elements)
            .map(name => camelcase(name, {pascalCase: true}))
            .join(`,\n${' '.repeat(4)}`)}
};
`;
    }
}

export default Processor;
export { ProcessorProp, ISVGElement };
