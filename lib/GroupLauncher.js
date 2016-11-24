const {exec} = require('child_process')
const path = require('path')
const config = require('../config')
const {Storage} = require('./StorageInterface')
const co = require('co')

function GroupLauncher(Storage){
    this.storage = Storage
    this.storage.getAllGroups([],(result) => {
        this.groups = result.records
    })
}

GroupLauncher.prototype.getGroupByName = function(name){
    let group = this.groups.filter((group) => group.name === name)
    if(group.length === 0){
        throw new Error('Unable to find group with the name provided.')
    }
    return group[0]
}

GroupLauncher.prototype.getPromiseArrayForGroup = function(group){

    return group.launchApps
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

GroupLauncher.prototype.launch = function (groupName, callback){
    let me = this
    co(function *(){

        let launchResult = {
            success: false,
            message: 'Internal launch error.',
            groupName,
            appList: []
        }
        let group = yield me.getGroupByName(groupName)

        Promise.all(me.getPromiseArrayForGroup(group))
        .then(launchMessages => {
            launchResult.success = true
            launchResult.message = `All apps in group "${groupName}" launched successfully.`
            launchResult.appList = launchMessages
            console.log(launchMessages)
            callback(launchResult)
        })
        .catch(error => {
            console.error(error)
            launchResult.message = error
            callback(launchResult)
        })
    })

}

module.exports = new GroupLauncher(Storage)
