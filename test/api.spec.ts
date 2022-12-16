'use strict';
import * as FS from 'fs';
import * as PATH from 'path';
import {jest, describe, it, beforeAll, afterAll, expect} from '@jest/globals';
import svgo from 'svgo';
import * as beautify from 'js-beautify';
import api from '../src/index';
import type {JSBeautifyOptions} from 'js-beautify';

const input = PATH.resolve(__dirname, 'asset')
    , beautifyOption: JSBeautifyOptions = {
    indent_char: ' ',
    indent_size: 4,
    indent_with_tabs: false,
    eol: '\n',
    end_with_newline: true
};

describe('j-icon api', () => {
    beforeAll(() => {
        jest.spyOn(svgo, 'optimize').mockImplementation((input) => {
            // 返回文件默认内容, 禁止 svgo 优化文件, 防止无法测试生成的代码内容
            return { data: input };
        });
    });

    afterAll(async () => jest.resetAllMocks());

    it('generate esm code', async () => {
        const code: string = await api({input, format: 'esm'})
            , template = FS.readFileSync(PATH.resolve(__dirname, 'template/index.esm.js'), 'utf8');
        expect(code).toBe(beautify.js(template, beautifyOption));
    });

    it('generate ts code', async () => {
        const code: string = await api({input, format: 'ts'})
            , template = FS.readFileSync(PATH.resolve(__dirname, 'template/index.ts'), 'utf8');
        expect(code).toBe(beautify.js(template, beautifyOption));
    });

    it('generate umd code', async () => {
        const code: string = await api({input, format: 'umd'})
            , template = FS.readFileSync(PATH.resolve(__dirname, 'template/index.umd.js'), 'utf8');
        expect(code).toBe(beautify.js(template, beautifyOption));
    });

    it('generate type code', async () => {
        const code: string = await api({input, format: 'type'})
            , template = FS.readFileSync(PATH.resolve(__dirname, 'template/index.d.ts'), 'utf8');
        expect(code).toBe(template);
    });
});
