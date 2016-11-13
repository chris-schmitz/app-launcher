#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const groupLauncher = require('../lib/GroupLauncher')


program
    .option('-l, --location <location>', 'The apps you want to open per a specific location (work, home, etc)')
    .parse(process.argv)

Promise.all(groupLauncher.getPromiseArrayForGroup(program.location))
    .then(result => console.log(chalk.blue(result.join('\n'))))
    .catch(result => console.log(chalk.red(result)))
