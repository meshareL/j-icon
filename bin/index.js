#!/usr/bin/env node
const { exit } = require('node:process')
    , chalk = require('chalk')
    , command = require('../dist/cli/command');

(async () => {
    try {
        await command(process.argv);
    } catch (e) {
        console.log(chalk.red.bold(`j-icon-cli: ${e}`));
        exit(1);
    }
})();
