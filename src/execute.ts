'use strict';
import FS from 'fs';
import PATH from 'path';
import {DefaultProcessor, LegacyProcessor, Processor} from './process';
import helper from './helper';
import {Option} from '../index';

async function doExecute(option: Option) {
    const {
        input,
        output,
        format = ['json', 'esm', 'umd', 'ts', 'type'],
        minify = false,
        target = 3,
        name = 'index'
    } = option ?? {};

    const elements = await helper(input);

    let processor: Processor;
    if (target === 2) {
        processor = new LegacyProcessor({elements, condense: minify});
    } else {
        processor = new DefaultProcessor({elements, condense: minify});
    }

    FS.mkdirSync(output, {recursive: true});

    const files: Record<string, string> = {};

    if (format.includes('json')) files[`${name}.json`] = processor.json();
    if (format.includes('esm')) files[`${name}.esm.js`] = await processor.module();
    if (format.includes('umd')) files[`${name}.umd.js`] = await processor.universalModule();
    if (format.includes('ts')) files[`${name}.ts`] = processor.typescript();
    if (format.includes('type')) files[`${name}.d.ts`] = processor.declare();

    for (const [name, value] of Object.entries(files)) {
        FS.writeFileSync(PATH.join(output, name), value, 'utf8');
    }
}

export default doExecute;
