import { readFileSync, lstatSync, readdirSync } from 'node:fs';
import { parse as pathParse, join } from 'node:path';
import { optimize } from 'svgo';
import type { Config } from 'svgo';
import { Window, Element } from 'happy-dom';

type SVGElement = {
    nodeName: string;
    attributes?: Record<string, string>;
    children?: SVGElement[];
};

const svgoConfig: Config = {
    multipass: true,
    plugins: [
        {
            name: 'preset-default',
            params: { overrides: { removeViewBox: false, sortAttrs: false } }
        },
        'removeXMLNS',
        'convertStyleToAttrs',
        'removeStyleElement',
        'removeScriptElement',
        { name: 'removeAttrs', params: { attrs: [ 'data-.*' ] } }
    ]
};

const window = new Window()
    , document = window.document;

function loadFile(path: string): string[] {
    const files: string[] = [];

    function fun(path: string): void {
        const status = lstatSync(path);
        if (status.isFile()) {
            const { ext } = pathParse(path);
            if (ext !== '.svg') return;
            files.push(path);
        }

        if (!status.isDirectory()) return;

        readdirSync(path).forEach(name => fun(join(path, name)));
    }

    fun(path);
    return files;
}

function transform(element: Element): SVGElement {
    const result: SVGElement = { nodeName: element.nodeName };

    if (element.hasAttributes()) {
        const attributes: Record<string, string> = {};
        for (const { name, value } of element.attributes) {
            attributes[name] = value;
        }

        result.attributes = attributes;
    }

    if (element.hasChildNodes()) {
        const children: SVGElement[] = [];
        element.childNodes.forEach(node => {
            // Node.ELEMENT_TYPE
            if (node.nodeType !== 1) return;
            children.push(transform(node as Element));
        });

        result.children = children;
    }

    return result;
}

function parse(path: string): Map<string, SVGElement> {
    const paths = loadFile(path)
        , elements = new Map<string, SVGElement>();

    for (const filePath of paths) {
        document.body.innerHTML = optimize(readFileSync(filePath, 'utf8'), svgoConfig).data;
        const element = document.querySelector('svg');

        if (!element) continue;

        elements.set(pathParse(filePath).name, transform(element));
    }

    return elements;
}

export default parse;
export type { SVGElement };
