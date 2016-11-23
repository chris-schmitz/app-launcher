const {LocalStorage} = require('./storageTypes/localStorage')
const {ElectronSettings} = require('./storageTypes/ElectronSettings')
const keyPrefix = "applauncher-"
const ipc = require('electron').ipcMain

function Record (name = null, launchApps = []){
    let id = `${keyPrefix}${Number(new Date())}`
    return {id, name, launchApps}
}


function StorageInterface(StorageMethod) {
    this.Storage = StorageMethod
}

module.exports = {
    Storage: new StorageInterface(ElectronSettings),
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

StorageInterface.prototype.getAll = function(payload, callback){
    this.Storage.getAllGroups((result) => {
        callback(result)
    })
}

StorageInterface.prototype.delete = function(record, callback){
    this.Storage.deleteGroups(record, (result) => {
        callback(result)
    })
};

StorageInterface.prototype.upsert = function(record, callback){
    this.Storage.upsertGroup(record, (result) => {
        callback(result)
    })
}
