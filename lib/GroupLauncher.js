const {exec} = require('child_process')
const path = require('path')
const config = require('../config')
const {Storage} = require('./StorageInterface')
const co = require('co')

function GroupLauncher(Storage){
    this.storage = Storage
    this.storage.getAll((groups) => {
        this.groups = groups
    })
}

GroupLauncher.prototype.getGroupByName = function(name){
    let group = this.groups.filter((group) => group.name === name)
    if(group.length === 0){
        throw new Error('Unable to find group with the name provided.')
    }
    return group
}

GroupLauncher.prototype.getPromiseArrayForGroup = function(groupName){
    co(function *(){
        // let groups = config.groups.filter(group => group.name === groupName)

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

    })
}

GroupLauncher.prototype.launch = function (groupName, callback){
    co(function *(){

        let launchResult = {
            success: false,
            message: 'Internal launch error.',
            groupName,
            appList: []
        }
        let group = yield this.getGroupByName(groupName)

        Promise.all(this.getPromiseArrayForGroup(group.name))
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
    })

}

module.exports = new GroupLauncher(Storage)
