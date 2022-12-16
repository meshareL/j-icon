'use strict';
import FS from 'fs';
import PATH from 'path';
import chalk from 'chalk';
import {createCommand, Command} from 'commander';
import execute from './index';
import type {OptionValues} from 'commander';

const pkg = JSON.parse(FS.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const defaultFormats = ['esm', 'umd', 'ts', 'type'];

function normalizePath(path: string): string {
    return PATH.isAbsolute(path) ? path : PATH.join(process.cwd(), path);
}

function executeFormat(value: string, prev: string[]): string[] {
    if (prev.length === defaultFormats.length
        && prev.every((val, i) => val === defaultFormats[i])) {
        return [value];
    }

    if (prev.some(val => val === value)) {
        return prev;
    }

    if (!defaultFormats.includes(value)) {
        return prev;
    }

    prev.push(value);
    return prev;
}

async function commandAction(options: OptionValues, command: Command): Promise<void> {
    const codes: Record<string, string> = {};

    try {
        for (const format of options.format) {
            const code = await execute({input: normalizePath(options.input), format});
            switch (format) {
                case 'esm': {
                    codes[`${options.name}.esm.js`] = code;
                    break;
                }
                case 'umd': {
                    codes[`${options.name}.umd.js`] = code;
                    break;
                }
                case 'ts': {
                    codes[`${options.name}.ts`] = code;
                    break;
                }
                case 'type': {
                    codes[`${options.name}.d.ts`] = code;
                    break;
                }
            }
        }
    } catch (e) {
        command.error(chalk.red.bold(`j-icon-cli: ${e}`), {exitCode: 1});
        // console.log(chalk.red.bold(`j-icon-cli: ${e}`));
        // process.exit(1);
    }

    const output = normalizePath(options.output);
    FS.mkdirSync(output, {recursive: true});

    for (const [name, code] of Object.entries(codes)) {
        FS.writeFileSync(PATH.join(output, name), code, 'utf8');
    }

    console.log(chalk.green.bold('j-icon-cli: Processing is complete'));
}

async function command(argv = process.argv): Promise<void> {
    const program = createCommand('j-icon')
        .allowUnknownOption(true)
        .version(pkg.version)
        .description(pkg.description)
        .requiredOption('-i, --input <path>', 'A file or directory path')
        .requiredOption('-o, --output <path>', 'File output directory')
        .option<string[]>('-f, --format [formats...]', 'Output file format', executeFormat, defaultFormats)
        .option('-n, --name [name]', 'Output file name', 'index')
        .action(commandAction);

    await program.parseAsync(argv);
}

export default command;
