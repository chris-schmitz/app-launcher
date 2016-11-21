#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const GroupLauncher = require('../lib/GroupLauncher')


program
    .option('-l, --location <location>', 'The apps you want to open per a specific location (work, home, etc)')
    .parse(process.argv)

GroupLauncher.launch(program.location, (result) => {
    if(result.success){
        console.log(chalk.blue(result.message))
    } else {
        console.log(chalk.red(result.message))
    }
})
