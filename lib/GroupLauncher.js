const {exec} = require('child_process')
const path = require('path')
const config = require('../config')
const chalk = require('chalk')
const {Storage, StorageActions} = require('./StorageInterface')
const co = require('co')

function GroupLauncher(Storage){
    this.storage = Storage
    this.groups = []
}

// Hmm, it seems silly that we're returning a promise for something that uses a
// promise structure. Once you get the overall feature working, come back and see
// if we can compact this.
GroupLauncher.prototype.getUpdatedGroupList = function(){
    return new Promise((resolve, reject) => {
        this.storage.handleRequest(StorageActions.GETALLGROUPS, [])
            .then(result => {
                resolve(result.records)
            })
            .catch(error => {
                resolve([])
            })
    })
}

GroupLauncher.prototype.getGroupByName = function(name){
    let group = this.groups.filter((group) => group.name === name)
    if(group.length === 0){
        console.error(`Unable to find group by name: ${group}`)
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
        console.log(chalk.blue(`Launching group: ${groupName}`))

        let launchResult = {
            success: false,
            message: 'Internal launch error.',
            groupName,
            appList: []
        }

        me.groups = yield me.getUpdatedGroupList()
        let group = yield me.getGroupByName(groupName)

        Promise.all(me.getPromiseArrayForGroup(group))
            .then(launchMessages => {
                console.log(launchMessages)
                launchResult.success = true
                launchResult.message = `All apps in group "${groupName}" launched successfully.`
                launchResult.appList = launchMessages
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
