const {LocalStorage} = require('./storageTypes/localStorage')
const settings = require('electron-settings')

const ipc = require('electron').ipcMain


let queryResult = {success: false, message: null, error: null, records: []}
const keyPrefix = "applauncher-"
const keyMap = {
    GROUPS: 'groups',
}

function Record (name = null, launchApps = []){
    let id = `${keyPrefix}${Number(new Date())}`
    return {id, name, launchApps}
}


function StorageInterface() {
}

module.exports = {
    Storage: new StorageInterface(),
    Record,
}

StorageInterface.prototype.handleRequest = function (requestType, payload){
    let me = this
    return new Promise(function(resolve, reject) {
        me[requestType](payload, (result) => {
            result.requestedAction = requestType
            if(result.success){
                resolve(result)
            } else {
                reject(new Error(result))
            }
        })
    })
}

StorageInterface.prototype.getAllGroups = function(payload, callback){
    settings.get(keyMap.GROUPS)
        .then(result => {
            queryResult.success = true
            queryResult.message = 'All groups retrieved.'
            queryResult.records = Object.keys(result)
                .map((key) => {
                    return result[key]
                })
                console.log()
                console.log()
                console.log()
            callback(queryResult)
        })
        .catch(error => {
            console.error(error)
            queryResult.error = error
            callback(queryResult)
        })
}

StorageInterface.prototype.deleteGroup = function(record, callback){
    if(!record.id){
        queryResult.error = error
        queryResult.message = "internal key error."
        callback(queryResult)
    }

    settings.delete(`${keyMap.GROUPS}.${record.id}`)
        .then(result => {
            queryResult.success = true
            queryResult.message = "Group deleted."
            callback(queryResult)
        })
        .catch(error => {
            queryResult.error = error
            queryResult.message = "Error deleting group."
            callback(queryResult)
        })
}


StorageInterface.prototype.upsertGroup = function(record, callback){
    if(!record.id){
        queryResult.error = error
        queryResult.message = "internal key error."
        callback(queryResult)
    }


    settings.set(`${keyMap.GROUPS}.${record.id}`, record)
        .then(result =>{
            queryResult.success = true
            queryResult.message = 'Changes saved.'
            callback(queryResult)
        })
        .catch(error =>{
            queryResult.error = error
            queryResult.message = 'Error while attempting to save the group.'
            callback(queryResult)
        })
}
