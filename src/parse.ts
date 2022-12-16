'use strict';
import * as FS from 'fs';
import * as PATH from 'path';
import {JSDOM} from 'jsdom';
import svgo from 'svgo';
import type { _SVGElement } from './type';

const encoding = 'utf8';

function transform(element: SVGElement): _SVGElement {
    const transformed: _SVGElement = { nodeName: element.nodeName };

    if (element.hasAttributes()) {
        const attributes: Record<string, string> = {};
        for (const {name, value} of element.attributes) {
            attributes[name] = value;
        }

        transformed.attributes = attributes;
    }

    if (element.hasChildNodes()) {
        const children: _SVGElement[] = [];
        element.childNodes.forEach(node => {
            // Node.ELEMENT_NODE
            if (node.nodeType !== 1 || !node.nodeName) {
                return;
            }

            children.push(transform(node as SVGElement));
        });

        transformed.children = children;
    }

    return transformed;
}

async function parse(path: string): Promise<Record<string, _SVGElement> | null> {
    const status = FS.lstatSync(path);
    if (status.isFile()) {
        const {name, ext} = PATH.parse(path);
        if (ext === '.svg') {
            const optimized = svgo.optimize(
                FS.readFileSync(path, encoding),
                await svgo.loadConfig(PATH.resolve(__dirname, '../svgo.config.cjs'))).data;

            const dom = new JSDOM(optimized, {contentType: 'image/svg+xml'})
                , element = dom.window.document.querySelector('svg');

            return element === null ? null : { [name]: transform(element) };

        } else {
            return null;
        }
    }

    if (!status.isDirectory()) {
        return null;
    }

    const transformed: Record<string, _SVGElement> = {};
    for (const filename of FS.readdirSync(path, encoding)) {
        const parsed = await parse(PATH.join(path, filename));
        if (parsed === null) {
            continue;
        }

        for (const [name, value] of Object.entries(parsed)) {
            transformed[name] = value;
        }
    }

    return Object.entries(transformed)
        .filter(([, value]) => Object.keys(value).length)
        .reduce<Record<string, _SVGElement>>((obj, [name, value]) => {
            obj[name] = value;
            return obj;
        }, {});
}

export default parse;
