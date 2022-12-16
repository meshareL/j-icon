#!/usr/bin/env node
'use strict';
const chalk = require('chalk')
    , execCommand = require('../dist/command');

(async () => {
    try {
        await execCommand(process.argv);
    } catch (e) {
        console.log(chalk.red.bold(`j-icon-cli: ${e}`));
        process.exit(1);
    }
})();
