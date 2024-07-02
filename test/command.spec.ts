import FS from 'node:fs';
import { resolve, dirname } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';
import { describe, it, vitest, expect } from 'vitest';
import command from '../src/cli/index';
import { js_beautify } from 'js-beautify';
import type { JSBeautifyOptions } from 'js-beautify';

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
    , jsBeautifyOption: JSBeautifyOptions = {
        indent_char: ' ',
        indent_size: 4,
        indent_with_tabs: false,
        eol: '\n',
        end_with_newline: true
    };

describe('j-icon cli command', () => {
    it.each([
        [ 'esm', 'esm.js' ],
        [ 'umd', 'umd.js' ],
        [ 'ts', 'ts' ],
        [ 'type', 'd.ts' ]
    ])('generate file', async (format, suffix) => {
        const filename = `index.${suffix}`
            , filePath = resolve(cwd(), 'test/generated', filename);

        const mkdirSync = vitest.spyOn(FS, 'mkdirSync').mockImplementation(vitest.fn())
            , writeFileSync = vitest.spyOn(FS, 'writeFileSync').mockImplementation(vitest.fn());

        await command([
            'node',
            '../dist/cli/command',
            '-i', 'test/asset',
            '-o', 'test/generated',
            '-f', format!
        ]);

        expect(mkdirSync).toHaveBeenCalled();
        expect(mkdirSync).toHaveBeenCalledWith(expect.anything(), expect.anything());
        expect(writeFileSync).toHaveBeenCalled();
        expect(writeFileSync).toHaveBeenCalledWith(filePath, expect.anything(), expect.anything());
    });

    it('multiple format', async () => {
        const filePaths = [
            resolve(cwd(), 'test/generated/index.esm.js'),
            resolve(cwd(), 'test/generated/index.umd.js')
        ];

        const mkdirSync = vitest.spyOn(FS, 'mkdirSync').mockImplementation(vitest.fn())
            , writeFileSync = vitest.spyOn(FS, 'writeFileSync').mockImplementation(vitest.fn());

        await command([
            'node',
            '../dist/cli/command',
            '-i', 'test/asset',
            '-o', 'test/generated',
            '-f', 'esm',
            '-f', 'umd'
        ]);

        const paths: string[] = [];
        for (const args of writeFileSync.mock.calls) {
            paths.push(args[0] as string);
        }

        expect(mkdirSync).toHaveBeenCalled();
        expect(writeFileSync).toHaveBeenCalledTimes(2);
        expect(paths).toEqual(expect.arrayContaining(filePaths));
    });

    it('ignore unknown format', async () => {
        const filePaths = [ resolve(cwd(), 'test/generated/index.esm.js') ]
            , mkdirSync = vitest.spyOn(FS, 'mkdirSync').mockImplementation(vitest.fn())
            , writeFileSync = vitest.spyOn(FS, 'writeFileSync').mockImplementation(vitest.fn());

        await command([
            'node',
            '../dist/cli/command',
            '-i', 'test/asset',
            '-o', 'test/generated',
            '-f', 'esm',
            '-f', 'wrong'
        ]);

        const paths: string[] = [];
        for (const args of writeFileSync.mock.calls) {
            paths.push(args[0] as string);
        }

        expect(mkdirSync).toHaveBeenCalled();
        expect(writeFileSync).toHaveBeenCalledTimes(1);
        expect(paths).toEqual(expect.arrayContaining(filePaths));
    });

    it('custom filename', async () => {
        const filePaths = [
            resolve(cwd(), 'test/generated/custom.esm.js'),
            resolve(cwd(), 'test/generated/custom.umd.js')
        ];

        const mkdirSync = vitest.spyOn(FS, 'mkdirSync').mockImplementation(vitest.fn())
            , writeFileSync = vitest.spyOn(FS, 'writeFileSync').mockImplementation(vitest.fn());

        await command([
            'node',
            '../dist/cli/command',
            '-i', 'test/asset',
            '-o', 'test/generated',
            '-f', 'esm',
            '-f', 'umd',
            '-n', 'custom'
        ]);

        const paths: string[] = [];
        for (const args of writeFileSync.mock.calls) {
            paths.push(args[0] as string);
        }

        expect(mkdirSync).toHaveBeenCalled();
        expect(writeFileSync).toHaveBeenCalledTimes(2);
        expect(paths).toEqual(expect.arrayContaining(filePaths));
    });

    it('multiple input paths', async () => {
        const template = FS.readFileSync(resolve(__dirname, 'template/multi-input.esm.js'), 'utf8')
            , mkdirSync = vitest.spyOn(FS, 'mkdirSync').mockImplementation(vitest.fn())
            , writeFileSync = vitest.spyOn(FS, 'writeFileSync').mockImplementation(vitest.fn());

        await command([
            'node',
            '../dist/cli/command',
            '-i', 'test/asset/directory',
            '-i', 'test/asset/folder',
            '-o', 'test/generated',
            '-f', 'esm'
        ]);

        const paths: string[] = []
            , codes: string[] = [];
        for (const args of writeFileSync.mock.calls) {
            paths.push(args[0] as string);
            codes.push(args[1] as string);
        }

        expect(mkdirSync).toHaveBeenCalled();
        expect(writeFileSync).toHaveBeenCalledTimes(1);
        expect(paths).toEqual(expect.arrayContaining([ resolve(cwd(), 'test/generated/index.esm.js') ]));
        expect(codes).toEqual(expect.arrayContaining([ js_beautify(template, jsBeautifyOption) ]));
    });
});
