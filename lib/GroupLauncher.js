const {exec} = require('child_process')
const path = require('path')
const config = require('../config')

function GroupLauncher(){}

GroupLauncher.getPromiseArrayForGroup = function(groupName){
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

GroupLauncher.launch = function (groupName, callback){
    let launchResult = {
        success: false,
        message: 'Internal launch error.',
        groupName,
        appList: []
    }

    Promise.all(this.getPromiseArrayForGroup(groupName))
    .then(launchMessages => {
        launchResult.success = true
        launchResult.message = `All apps in group "${groupName}" launched successfully.`
        launchResult.appList = launchMessages
        callback(launchResult)
    })
    .catch(error => {
        launchResult.message = error
        callback(launchResult)
    })

}

module.exports = GroupLauncher
