'use strict';
import PATH from 'path';
import chalk from 'chalk';
import commander from 'commander';
import pkg from '../package.json';
import execute from './execute';

const defaultFormats = ['json', 'esm', 'umd', 'ts', 'type'];

function normalizePath(path: string): string {
    return PATH.isAbsolute(path) ? path : PATH.join(process.cwd(), path);
}

function executeFormat(value: string, prev: string[]): string[] {
    if (prev.length === defaultFormats.length
        && prev.every((val, i) => val === defaultFormats[i])) {
        return [value];
    }

    prev.push(value);
    return prev;
}

commander
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .allowUnknownOption(true)
    .name('j-icon')
    .version(pkg.version)
    .description(pkg.description)
    .requiredOption('-i, --input <path>', 'A file or directory path')
    .requiredOption('-o, --output <path>', 'File output directory')
    .option('-m, --minify', 'Compressed file', false)
    .option<string[]>('-f, --format [formats...]', 'Output file format', executeFormat, defaultFormats)
    .option<number>('-t, --target [version]', 'Target Vue version, 2 or 3', value => Number.parseInt(value, 10), 3)
    .option('-n, --name [name]', 'Output file name', 'index')
    .parse(process.argv);

(async () => {
    const opts = commander.opts();
    try {
        await execute({
            input: normalizePath(opts.input),
            output: normalizePath(opts.output),
            format: opts.format,
            minify: opts.minify,
            target: opts.target,
            name: opts.name
        });
    } catch (e) {
        console.log(chalk.red.bold(`j-icon-cli: ${e}`));
        process.exit(1);
    }

    console.log(chalk.green.bold('j-icon-cli: Processing is complete'));
    process.exit(0);
})();
