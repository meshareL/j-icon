'use strict';
import Processor, {ISVGElement} from './processor';
import {Format, Version} from './misc';
import camelcase from "camelcase";

class LegacyProcessor extends Processor {
    get version(): Version {
        return Version.VERSION_2;
    }

    universalModule(): Promise<string> {
        const code =  `${this.banner}
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JIconIcons = factory());
}(this, function() {
    'use strict';
    ${Object.entries(this.elements).map(([key, value]) => this.transformElement(key, value, Format.UMD)).join('\n\n')}

    return {
        default: {${Object.keys(this.elements).map(name => `'${name}': ${camelcase(name, {pascalCase: true})}`).join(',')}},
        ${Object.keys(this.elements).map(name => camelcase(name, {pascalCase: true})).join(',')}
    };
}));
`;
        return this.isCondense ? this.condense(code, {keep_classnames: false, keep_fnames: false, toplevel: false}) : Promise.resolve(this.format(code));
    }

    protected transformChild(element: ISVGElement, format: Format): string {
        const nodes: string[] = [];
        if (element.children) {
            element.children.forEach(node => {
                const formatted = this.transformChild(node, format);
                if (!formatted) return;
                nodes.push(formatted);
            });
        }

        const attrCode = this.serializeAttribute(element.attributes ?? {})
            , nodeCode = this.serialize(nodes)
            , delimiter = attrCode && nodeCode ? ', ' : '';

        return `h('${element.nodeName}', ${attrCode}${delimiter}${nodeCode})`;
    }

    private serializeAttribute(attributes: Record<string, string>): string {
        const {class: clazz, style, ...attrs} = attributes;
        const attr = this.serialize(attrs);

        const codes = [];
        if (clazz) codes.push(`staticClass: '${clazz}'`);
        if (style) codes.push(`style: '${style}'`);
        if (attr) codes.push(`attrs: ${attr}`);

        return codes.length ? `{${codes.join(', ')}}` : '';
    }
}

export default LegacyProcessor;
