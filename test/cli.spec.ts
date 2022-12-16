'use strict';
import FS from 'fs';
import PATH from 'path';
import {jest, describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import command from '../dist/command';

describe('j-icon cli', () => {
    const mkdir_sync = jest.fn<typeof FS.mkdirSync>()
        , write_file_sync = jest.fn<typeof FS.writeFileSync>()
        , map: Record<string, string> = { esm: 'esm.js', umd: 'umd.js', ts: 'ts', type: 'd.ts' };

    async function execCommand(...formats: string[]) {
        await command([
            'node',
            '../dist/command',
            '-i', 'test/asset',
            '-o', 'test/generated',
            '-f', ...formats
        ]);
    }

    beforeEach(() => {
        jest.spyOn(FS, 'mkdirSync').mockImplementation(mkdir_sync);
        jest.spyOn(FS, 'writeFileSync').mockImplementation(write_file_sync);
    });

    afterEach(async () => jest.resetAllMocks());

    it.each(['esm', 'umd', 'ts', 'type'])('generated file', async (format: string) => {
        const filename = `index.${map[format]}`
            , filePath = PATH.resolve(process.cwd(), 'test/generated', filename);

        await execCommand(format);

        expect(mkdir_sync).toHaveBeenCalled();
        expect(mkdir_sync).toHaveBeenLastCalledWith(expect.anything(), expect.anything());
        expect(write_file_sync).toHaveBeenCalled();
        expect(write_file_sync).toHaveBeenLastCalledWith(filePath, expect.anything(), expect.anything());
    });

    it('multiple format', async () => {
        const filePaths = [
            PATH.resolve(process.cwd(), 'test/generated/index.esm.js'),
            PATH.resolve(process.cwd(), 'test/generated/index.umd.js')
        ];

        await execCommand('esm', 'umd');

        const paths: string[] = [];
        for (const args of write_file_sync.mock.calls) {
            paths.push(args[0] as string);
        }

        expect(mkdir_sync).toHaveBeenCalled();
        expect(write_file_sync).toHaveBeenCalledTimes(2);
        expect(paths).toStrictEqual(expect.arrayContaining(filePaths));
    });

    it('custom filename', async () => {
        const filePaths = [
            PATH.resolve(process.cwd(), 'test/generated/icons.esm.js'),
            PATH.resolve(process.cwd(), 'test/generated/icons.umd.js')
        ];

        await command([
            'node',
            '../dist/command',
            '-i', 'test/asset',
            '-o', 'test/generated',
            '-f', 'esm', 'umd',
            '-n', 'icons'
        ]);

        const paths: string[] = [];
        for (const args of write_file_sync.mock.calls) {
            paths.push(args[0] as string);
        }

        expect(mkdir_sync).toHaveBeenCalled();
        expect(write_file_sync).toHaveBeenCalledTimes(2);
        expect(paths).toStrictEqual(expect.arrayContaining(filePaths));
    });
});
