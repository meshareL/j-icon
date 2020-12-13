'use strict';
import PATH from 'path';
import chalk from 'chalk';
import commander from 'commander';
import pkg from '../package.json';
import execute from './execute';

commander
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .name('j-icon')
    .version(pkg.version)
    .description(pkg.description)
    .allowUnknownOption(true)
    .requiredOption('-i, --input <path>', 'A file or directory path')
    .requiredOption('-o, --output <path>', 'File output directory')
    .option('-m, --minify', 'Compressed file', false)
    .option<string[]>('-f, --format [formats...]', 'Output file format', value => value.split(/\s+/), ['json', 'esm', 'umd', 'ts', 'type'])
    .option<number>('-t, --target [version]', 'Target Vue version, 2 or 3', value => Number.parseInt(value, 10), 3)
    .option('-n, --name [name]', 'Output file name', 'index')
    .parse(process.argv);

function normalizePath(path: string): string {
    return PATH.isAbsolute(path) ? path : PATH.join(process.cwd(), path);
}

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
