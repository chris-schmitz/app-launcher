#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const {exec} = require('child_process')
const path = require('path')
const config = require('../config')


program
    .option('-l, --location <location>', 'The apps you want to open per a specific location (work, home, etc)')
    .parse(process.argv)

let applist = config[program.location]

applist.forEach((appPath) => {
    exec(`open "${appPath}"`, (err,stdout,stderr) => {
        if(err) throw new Error(chalk.red(err))
        if(stderr) throw new Error(chalk.red(stderr))
        console.log(`Opened application: ${ chalk.blue( path.basename(appPath) ) }`)
    })
})
