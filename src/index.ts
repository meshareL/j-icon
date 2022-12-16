'use strict';
import chalk from 'chalk';
import parse from './parse';
import generateCode from './generate';
import {Format} from './enums';
import type {Option} from '../index';

const map = {
    esm: Format.MODULE,
    umd: Format.UMD,
    ts: Format.TYPESCRIPT,
    type: Format.DECLARE
};

async function doExecute(option: Option): Promise<string> {
    const {
        input,
        format
    } = option ?? {};

    const elements = await parse(input);
    if (elements === null) {
        console.log(chalk.yellow.bold(`j-icon-cli: No files found`));
        process.exit(0);
    }

    return generateCode(elements, map[format]);
}

export default doExecute;
