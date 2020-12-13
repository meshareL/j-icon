'use strict';
import FS from 'fs';
import PATH from 'path';
import jsYaml from 'js-yaml';
import SVGO, {Options} from 'svgo';
import jsdom from 'jsdom';
import {ISVGElement} from './process';

const encoding = 'utf8'
    , confPath = PATH.join(__dirname, '../.svgo.yml')
    , conf = FS.readFileSync(confPath, encoding)
    , svgo = new SVGO(jsYaml.safeLoad(conf) as Options);

function transform(element: Element): ISVGElement | null {
    const result: ISVGElement = {nodeName: element.nodeName};

    if (element.hasAttributes()) {
        const attributes: Record<string, string> = {};
        for (const {name, value} of element.attributes) {
            attributes[name] = value;
        }
        result.attributes = attributes;
    }

    if (element.hasChildNodes()) {
        const children: ISVGElement[] = [];
        element.childNodes.forEach(node => {
            // Node.ELEMENT_NODE
            if (node.nodeType !== 1) return;
            if (!node.nodeName) return;

            const ed = transform(node as Element);
            if (!ed) return;
            children.push(ed);
        });
        result.children = children;
    }

    return result;
}

async function handle(content: string): Promise<ISVGElement | null> {
    const processed = (await svgo.optimize(content)).data
        , element = new jsdom.JSDOM(processed).window.document.querySelector('svg');
    return element ? transform(element) : null;
}

async function loadFile(path: string): Promise<Record<string, ISVGElement>> {
    const status = FS.lstatSync(path);
    if (status.isFile()) {
        const parsed = PATH.parse(path);
        if (parsed.ext !== '.svg') {
            return {};
        } else {
            const handled = await handle(FS.readFileSync(path, encoding));
            return handled ? {[parsed.name]: handled} : {};
        }
    }

    if (!status.isDirectory()) return {};

    const value: Record<string, ISVGElement> = {};
    for (const filename of FS.readdirSync(path, encoding)) {
        const files = await loadFile(PATH.join(path, filename));
        for (const [name, val] of Object.entries(files)) {
            value[name] = val;
        }
    }

    return Object.entries(value)
        .filter(([, val]) => Object.keys(val).length)
        .reduce<Record<string, ISVGElement>>((obj, [name, val]) => {
            obj[name] = val;
            return obj;
        }, {});
}

export default loadFile;
