const {exec} = require('child_process')
const path = require('path')
const config = require('../config')

module.exports.getPromiseArrayForGroup = function(groupName){
    let groups = config.groups.filter(group => group.name === groupName)

    if(!groups) throw new Error(`Invalid location argument: "${groupName}".`)


    return groups
        .map(group => group.launchApps)
        .reduce((carry, appPath) => carry.concat(appPath))
        .map(appPath => {
            return new Promise((resolve, reject) => {
                exec(`open "${appPath}"`, (err,stdout,stderr) => {
                    if(err) reject(new Error(err))
                    if(stderr) reject(new Error(stderr))
                    resolve(`Opened application: ${  path.basename(appPath) }`)
                })
            })
        })
}
