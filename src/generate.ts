'use strict';
import type {JSBeautifyOptions} from 'js-beautify';
import * as beautify from 'js-beautify';
import camelcase from 'camelcase';
import {Format} from './enums';
import type {_SVGElement} from './type';

const BANNER = '/* THIS FILE IS GENERATED. DO NOT EDIT IT. */'
    , beautifyOption: JSBeautifyOptions = {
    indent_char: ' ',
    indent_size: 4,
    indent_with_tabs: false,
    eol: '\n',
    end_with_newline: true
};

// 使用文件原名
function exportVariable(names: string[]): { defaultExport: string, namedExport: string } {
    const executed = names.map(name => [name, camelcase(name, {pascalCase: true})])
        , defaultExport =
        `{\n${' '.repeat(4)}${executed
            .map(([name, pascalCase]) => `'${name}': ${pascalCase}`)
            .join(`,\n${' '.repeat(4)}`)}\n}`
        , namedExport = `${executed.map(([, name]) => name).join(`,\n${' '.repeat(4)}`)}`;

    return { defaultExport, namedExport };
}

function serializeAttribute(attributes: Record<string, string>): string {
    const text = Object.entries(attributes)
        .map(([name, value]) => `'${name}': '${value}'`)
        .join(', ');
    return text ? `{${text}}` : '';
}

function serializeChild(element: _SVGElement, format: Format): string {
    const nodes: string[] = [];
    (element.children || []).forEach(child => {
        const node = serializeChild(child, format);
        if (!node) {
            return;
        }

        nodes.push(node);
    });

    const attrCode = serializeAttribute(element.attributes || {})
        , nodeCode = nodes.length ? `[${nodes.join(', ')}]` : ''
        , delimiter = attrCode && nodeCode ? ', ' : ''
        , render = format === Format.UMD ? '_vue.h' : 'h';

    return `${render}('${element.nodeName}', ${attrCode}${delimiter}${nodeCode})`;
}

function serializeElement(name: string, element: _SVGElement, format: Format): string {
    let {viewBox, width, height, ...attributes} = element.attributes!;
    const viewbox = viewBox.split(/\s+/).map(val => Number.parseInt(val, 10));
    width = width ?? viewbox[2];
    height = height ?? viewbox[3];

    const codes = [
        `name: '${name}'`,
        `viewBox: [${viewbox.join(', ')}]`,
        `size: [${width}, ${height}]`
    ];

    if (Object.keys(attributes).length) {
        codes.push(`attributes: ${serializeAttribute(attributes)}`);
    }

    const suffix = format === Format.TYPESCRIPT
        ? `: Icon<${width}, ${height}>`
        : '';

    return `const ${camelcase(name, {pascalCase: true})}${suffix} = {
    ${codes.join(', ')},
    render: () => [${(element.children || []).map(value => serializeChild(value, format))}]
};`;
}

function generateUMD(elements: Record<string, _SVGElement>): string {
    const {defaultExport, namedExport} = exportVariable(Object.keys(elements));
    return `${BANNER}
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
    typeof define === 'function' && define.amd ? define(['vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JIconIcons = factory(global.Vue));
}(this, function(_vue) {
    'use strict';
        ${Object
        .entries(elements)
        .map(([name, value]) => serializeElement(name, value, Format.UMD))
        .join('\n\n')
    }

        return {
            default: ${defaultExport},
            ${namedExport}
        };
}));
`;
}

function generateModule(elements: Record<string, _SVGElement>, format: Format): string {
    const codes: string[] = [
        BANNER,
        "import {h} from 'vue';"
    ];
    if (format === Format.TYPESCRIPT) {
        codes.push("import {Icon} from '@tomoeed/j-icon';");
    }

    let code = codes.join('\n') + '\n\n';

    code += Object
        .entries(elements)
        .map(([name, value]) => serializeElement(name, value, format))
        .join('\n\n');

    const {defaultExport, namedExport} = exportVariable(Object.keys(elements));
    code += `\n
    export default ${defaultExport};
    export {${namedExport}};
    `;

    return code;
}

function generateDeclare(elements: Record<string, _SVGElement>): string {
    const type = (attributes: Record<string, string> | undefined): string => {
        if (attributes !== undefined && attributes.width && attributes.height) {
            return `Icon<${attributes.width}, ${attributes.height}>`;
        }

        return 'Icon';
    }
        , variable = (name: string, element: _SVGElement): string =>
        `const ${camelcase(name, {pascalCase: true})}: ${type(element.attributes)}`

        , {defaultExport, namedExport} = exportVariable(Object.keys(elements));

    return `${BANNER}
import {Icon} from '@tomoeed/j-icon';

${Object.entries(elements)
        .map(([key, value]) => variable(key, value))
        .join(';\n')
    };

export default ${defaultExport};
export {
    ${namedExport}
};
`;
}

function generate(elements: Record<string, _SVGElement>, format: Format): string {
    if (format === Format.DECLARE) {
        return generateDeclare(elements);
    }

    let code: string;
    if (format === Format.UMD) {
        code = generateUMD(elements);
    } else {
        code = generateModule(elements, format);
    }

    return beautify.js(code, beautifyOption);
}

export default generate;
