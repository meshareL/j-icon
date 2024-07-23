import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vitest } from 'vitest';
import parse from '../src/cli/parse';
import generate, { Format } from '../src/cli/generate';
import { format as prettierFormat } from 'prettier';

vitest.mock('svgo', async importOriginal => {
    return {
        ...await importOriginal<typeof import('svgo')>(),
        optimize: (input: string) => {
            // 返回文件默认内容, 禁止 svgo 优化文件, 否则无法准确测试生成的代码内容
            return { data: input };
        }
    };
});

const __dirname = dirname(fileURLToPath(import.meta.url)),
      elements = new Map(Array.from(parse(resolve(__dirname, 'asset')).entries()).sort(([ a ], [ b ]) => a.localeCompare(b)));

describe('j-icon cli generate', () => {
    it('generate esm code', async () => {
        const code = await generate(elements, Format.ECMA_SCRIPT_MODULE),
              template = readFileSync(resolve(__dirname, 'template', 'index.esm.js'), 'utf8');
        expect(code).toBe(await prettierFormat(template, { tabWidth: 4, singleQuote: true, trailingComma: 'none', parser: 'babel' }));
    });

    it('generate umd code', async () => {
        const code = await generate(elements, Format.UNIVERSAL_MODULE),
              template = readFileSync(resolve(__dirname, 'template', 'index.umd.js'), 'utf8');
        expect(code).toBe(await prettierFormat(template, { tabWidth: 4, singleQuote: true, trailingComma: 'none', parser: 'babel' }));
    });

    it('generate ts code', async () => {
        const code = await generate(elements, Format.TYPESCRIPT),
              template = readFileSync(resolve(__dirname, 'template', 'index.ts'), 'utf8');
        expect(code).toBe(await prettierFormat(template, { tabWidth: 4, singleQuote: true, trailingComma: 'none', parser: 'typescript' }));
    });

    it('generate declare code', async () => {
        const code = await generate(elements, Format.DECLARE),
              template = readFileSync(resolve(__dirname, 'template', 'index.d.ts'), 'utf8');
        expect(code).toBe(template);
    });
});
