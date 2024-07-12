#!/usr/bin/env node
import process from 'node:process';
import chalk from 'chalk';
import command from '../dist/cli/command.js';

(async () => {
    try {
        await command(process.argv);
    } catch (e) {
        console.log(chalk.red.bold(`j-icon-cli: ${e}`));
        process.exit(1);
    }
})();
