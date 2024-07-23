import FS from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { cwd } from 'node:process';
import chalk from 'chalk';
import { createCommand } from 'commander';
import type { Command } from 'commander';
import type { SVGElement } from './parse';
import parse from './parse';
import generate, { Format } from './generate';

type OptionValue = {
    input: string[];
    output: string;
    format: string[];
    name: string;
};

const pkg = JSON.parse(FS.readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../package.json'), 'utf8')),
      formatOptionalValues = [ 'esm', 'umd', 'ts', 'type' ];

async function commandAction(options: OptionValue, command: Command): Promise<void> {
    const formats = options.format
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(value => formatOptionalValues.includes(value));

    const elements: Map<string, SVGElement> = new Map();

    for (const path of options.input) {
        const result = parse(resolve(cwd(), path));
        console.log(`The path '${path}' found ${result.size} elements`);

        result.forEach((value, key) => elements.set(key, value));
    }

    const codes = new Map<string, string>();

    try {
        for (const format of formats) {
            switch (format) {
            case 'umd':
                codes.set(`${options.name}.umd.js`, await generate(elements, Format.UNIVERSAL_MODULE));
                break;
            case 'esm':
                codes.set(`${options.name}.esm.js`, await generate(elements, Format.ECMA_SCRIPT_MODULE));
                break;
            case 'ts':
                codes.set(`${options.name}.ts`, await generate(elements, Format.TYPESCRIPT));
                break;
            case 'type':
                codes.set(`${options.name}.d.ts`, await generate(elements, Format.DECLARE));
                break;
            }
        }
    } catch (e) {
        command.error(chalk.red.bold(`j-icon-cli: ${e}`), { exitCode: 1 });
    }

    const output = resolve(cwd(), options.output);
    if (!FS.existsSync(output)) {
        FS.mkdirSync(output, { recursive: true });
    }

    for (const [ filename, code ] of codes.entries()) {
        FS.writeFileSync(resolve(output, filename), code, 'utf8');
    }

    console.log(chalk.green.bold('j-icon-cli: Processing is complete'));
    return Promise.resolve();
}

async function command(args = process.argv): Promise<void> {
    const program = createCommand('j-icon')
        .allowUnknownOption(true)
        .version(pkg.version)
        .description('j-icon command line interface')
        .requiredOption('-i --input <paths...>', 'A file or directory path')
        .requiredOption('-o --output <path>', 'File output directory')
        .option(
            '-f --format [formats...]',
            'Output file format, optional values: esm, umd, ts, type',
            [ 'esm', 'type' ]
        )
        .option('-n --name [name]', 'Output file name', 'index')
        .action(commandAction);

    await program.parseAsync(args);
}

export default command;
