'use strict';
import camelcase from 'camelcase';
import Processor, {ISVGElement} from './processor';
import {Format, Version} from './misc';

class DefaultProcessor extends Processor {
    get version(): Version {
        return Version.VERSION_3;
    }

    universalModule(): Promise<string> {
        const code =  `${this.banner}
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
    typeof define === 'function' && define.amd ? define(['vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JIconIcons = factory(global.Vue));
}(this, function(vue) {
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

        const attrCode = this.serialize(element.attributes ?? {})
            , nodeCode = this.serialize(nodes)
            , delimiter = attrCode && nodeCode ? ', ' : '';

        return `${format === Format.UMD ? 'vue.h' : 'h'}('${element.nodeName}', ${attrCode}${delimiter}${nodeCode})`;
    }
}

export default DefaultProcessor;
