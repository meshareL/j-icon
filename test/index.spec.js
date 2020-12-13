'use strict';
const FS = require('fs');
const PATH = require('path');
const process = require('../dist/index');

describe('j-icon cli', () => {
    beforeEach(() => jest.spyOn(FS, 'mkdirSync').mockImplementation());
    afterEach(() => jest.restoreAllMocks());

    it('format option', async () => {
        const wrote = []
            , map = {
            'json': PATH.join(__dirname, 'dist', 'index.json'),
            'esm': PATH.join(__dirname, 'dist', 'index.esm.js'),
            'umd': PATH.join(__dirname, 'dist', 'index.umd.js'),
            'ts': PATH.join(__dirname, 'dist', 'index.ts'),
            'type': PATH.join(__dirname, 'dist', 'index.d.ts')
        };

        jest.spyOn(FS, 'writeFileSync').mockImplementation((path, data) => {
            expect(data).not.toHaveLength(0);
            wrote.push(path);
        });

        await process({input: PATH.join(__dirname, 'asset'), output: PATH.join(__dirname, 'dist'), format: Object.keys(map)});

        expect(wrote).toEqual(expect.arrayContaining(Object.values(map)));
    });


    it('target Vue version', async () => {
        jest.spyOn(FS, 'writeFileSync').mockImplementation((path, data) => expect(data).not.toHaveLength(0));

        await process({input: PATH.join(__dirname, 'asset'), output: PATH.join(__dirname, 'dist'), version: 2});
        await process({input: PATH.join(__dirname, 'asset'), output: PATH.join(__dirname, 'dist'), version: 3});
    });

    it('output filename', async () => {
        const filenames = []
            , expects = ['icon.json', 'icon.esm.js', 'icon.umd.js', 'icon.ts', 'icon.d.ts'];

        jest.spyOn(FS, 'writeFileSync').mockImplementation(path => filenames.push(PATH.basename(path)));

        await process({input: PATH.join(__dirname, 'asset'), output: PATH.join(__dirname, 'dist'), name: 'icon'});

        expect(filenames).toEqual(expect.arrayContaining(expects));
    });
});
