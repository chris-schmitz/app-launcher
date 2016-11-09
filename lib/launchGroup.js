const {exec} = require('child_process')
const path = require('path')
const config = require('../config')

module.exports.getPromiseArrayForGroup = function(groupName){
    let applist = config[groupName]
    if(!applist) throw new Error(chalk.red('Invalid location argument.'))

    return applist.map((appPath) => {
        return new Promise((resolve, reject) => {

            exec(`open "${appPath}"`, (err,stdout,stderr) => {
                if(err) reject(new Error(err))
                if(stderr) reject(new Error(stderr))
                resolve(`Opened application: ${  path.basename(appPath) }`)
            })
        })
    })
}
