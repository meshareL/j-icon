import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vitest } from 'vitest';
import parse from '../src/cli/parse';
import generate, { Format } from '../src/cli/generate';
import type { JSBeautifyOptions } from 'js-beautify';
import { js_beautify } from 'js-beautify';

vitest.mock('svgo', async importOriginal => {
    return {
        ...await importOriginal<typeof import('svgo')>(),
        optimize: (input: string) => {
            // 返回文件默认内容, 禁止 svgo 优化文件, 否则无法准确测试生成的代码内容
            return { data: input };
        }
    };
});

const __dirname = dirname(fileURLToPath(import.meta.url))
    , elements = new Map(Array.from(parse(resolve(__dirname, 'asset')).entries()).sort(([ a ], [ b ]) => a.localeCompare(b)))
    , jsBeautifyOption: JSBeautifyOptions = {
        indent_char: ' ',
        indent_size: 4,
        indent_with_tabs: false,
        eol: '\n',
        end_with_newline: true
    };

describe('j-icon cli generate', () => {
    it('generate esm code', () => {
        const code = generate(elements, Format.ECMA_SCRIPT_MODULE)
            , template = readFileSync(resolve(__dirname, 'template', 'index.esm.js'), 'utf8');
        expect(code).toBe(js_beautify(template, jsBeautifyOption));
    });

    it('generate umd code', () => {
        const code = generate(elements, Format.UNIVERSAL_MODULE)
            , template = readFileSync(resolve(__dirname, 'template', 'index.umd.js'), 'utf8');
        expect(code).toBe(js_beautify(template, jsBeautifyOption));
    });

    it('generate ts code', () => {
        const code = generate(elements, Format.TYPESCRIPT)
            , template = readFileSync(resolve(__dirname, 'template', 'index.ts'), 'utf8');
        expect(code).toBe(js_beautify(template, jsBeautifyOption));
    });

    it('generate declare code', () => {
        const code = generate(elements, Format.DECLARE)
            , template = readFileSync(resolve(__dirname, 'template', 'index.d.ts'), 'utf8');
        expect(code).toBe(template);
    });
});
