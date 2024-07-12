import { format as prettierFormat } from 'prettier';
import type { Options } from 'prettier';
import camelcase from 'camelcase';
import type { SVGElement } from './parse';

const enum Format {
    UNIVERSAL_MODULE,
    ECMA_SCRIPT_MODULE,
    TYPESCRIPT,
    DECLARE
}

const BANNER = '/* THIS FILE IS GENERATED. DO NOT EDIT IT. */';

function exportVariable(names: string[]): { defaultExport: string; namedExport: string } {
    const transformed = names.map(name => [ name, camelcase(name, { pascalCase: true }) ]);

    const defaultExport = `{
${' '.repeat(4)}${transformed.map(([ name, pascalCase ]) => `'${name}': ${pascalCase}`).join(`,\n${' '.repeat(4)}`)}
}`;

    const namedExport = `${transformed.map(([ , name ]) => name).join(`,\n${' '.repeat(4)}`)}`;

    return { defaultExport, namedExport };
}

function serializeAttribute(attributes: Record<string, string>): string {
    const code = Object.entries(attributes)
        .map(([ name, value ]) => `'${name}': '${value}'`)
        .join(', ');
    return code ? `{${code}}` : '';
}

function serializeChild(element: SVGElement, format: Format): string {
    const nodes: string[] = [];
    (element.children || []).forEach(child => {
        const node = serializeChild(child, format);
        if (!node) return;

        nodes.push(node);
    });

    const attrCode = serializeAttribute(element.attributes || {})
        , nodeCode = nodes.length ? `[${nodes.join(', ')}]` : ''
        , delimiter = attrCode && nodeCode ? ', ' : ''
        , render = format === Format.UNIVERSAL_MODULE ? '_vue.h' : 'h';

    return `${render}('${element.nodeName}', ${attrCode}${delimiter}${nodeCode})`;
}

function serializeElement(name: string, element: SVGElement, format: Format): string {
    const { viewBox, width, height, ...attributes } = element.attributes || {};
    const viewbox = viewBox ? viewBox.split(/\s+/) : [];

    const _width = width ?? viewbox[2];
    const _height = height ?? viewbox[3];

    const codes = [
        `name: '${name}'`,
        viewbox.length && `viewBox: [${viewbox.join(', ')}]`,
        _width && _height && `size: [${_width}, ${_height}]`
    ];

    if (Object.keys(attributes).length) {
        codes.push(`attributes: ${serializeAttribute(attributes)}`);
    }

    const suffix = format === Format.TYPESCRIPT
        ? `: Icon<${_width}, ${_height}>`
        : '';

    return `const ${camelcase(name, { pascalCase: true })}${suffix} = {
    ${codes.join(', ')},
    render: () => [${(element.children || []).map(value => serializeChild(value, format))}]
};`;
}

function generateUniversalModule(elements: Map<string, SVGElement>): string {
    const { defaultExport, namedExport } = exportVariable(Array.from(elements.keys()));

    return `${BANNER}
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
    typeof define === 'function' && define.amd ? define(['vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JIconIcons = factory(global.Vue));
}(this, function(_vue) {
    'use strict';
    ${
        Array.from(elements.entries())
        .map(([ name, element ]) => serializeElement(name, element, Format.UNIVERSAL_MODULE))
        .join('\n\n')
    }

    return {
        default: ${defaultExport},
        ${namedExport}
    };
}));
`;
}

function generateEcmaModule(elements: Map<string, SVGElement>, format: Format): string {
    const codes = [
        BANNER,
        // eslint-disable-next-line @stylistic/quotes
        "import {h} from 'vue';"
    ];

    if (format === Format.TYPESCRIPT) {
        codes.push(`import type { Icon } from '@tomoeed/j-icon';`);
    }

    let code = codes.join('\n') + '\n\n';

    code += Array.from(elements.entries())
        .map(([ name, element ]) => serializeElement(name, element, format))
        .join('\n\n');

    const { defaultExport, namedExport } = exportVariable(Array.from(elements.keys()));
    code += `\n
export default ${defaultExport};
export {
    ${namedExport}
};
`;

    return code;
}

function generateDeclare(elements: Map<string, SVGElement>): string {
    const type = (attributes: Record<string, string> | undefined): string => {
        if (attributes && attributes['width'] && attributes['height']) {
            return `Icon<${attributes['width']}, ${attributes['height']}>`;
        }
        return 'Icon';
    };

    const variable = (name: string, element: SVGElement): string => {
        return `const ${camelcase(name, { pascalCase: true })}: ${type(element.attributes)}`;
    };

    const { defaultExport, namedExport } = exportVariable(Array.from(elements.keys()));

    return `${BANNER}
import { Icon } from '@tomoeed/j-icon';

${Array.from(elements).map(([ name, element ]) => variable(name, element)).join(';\n')};

export default ${defaultExport};
export {
    ${namedExport}
};
`;
}

function generate(elements: Map<string, SVGElement>, format: Format): Promise<string> {
    if (format === Format.DECLARE) {
        return Promise.resolve(generateDeclare(elements));
    }

    let code: string;
    if (format === Format.UNIVERSAL_MODULE) {
        code = generateUniversalModule(elements);
    } else {
        code = generateEcmaModule(elements, format);
    }

    const option: Options = {
        tabWidth: 4,
        singleQuote: true,
        trailingComma: 'none',
        parser: format === Format.TYPESCRIPT ? 'typescript' : 'babel'
    };

    return prettierFormat(code, option);
}

export default generate;
export { Format };
