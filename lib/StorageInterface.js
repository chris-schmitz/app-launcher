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
            if(result.success){
                resolve(result)
            } else {
                reject(new Error(result))
            }
        })
    })
}

StorageInterface.prototype.getAll = function(callback){
    this.Storage.getAll((result) => {
        callback(result)
    })
}

StorageInterface.prototype.delete = function(record, callback){
    this.Storage.delete(record, (result) => {
        callback(result)
    })
};

// StorageInterface.prototype.getById = function (id){
//     return this.Storage.get(id)
// };

StorageInterface.prototype.upsert = function(record, callback){
    this.Storage.upsert(record, (result) => {
        callback(result)
    })
}
