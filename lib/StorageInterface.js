const {LocalStorage} = require('./storageTypes/localStorage')
const settings = require('electron-settings')

const ipc = require('electron').ipcMain


let queryResult = {success: false, message: null, error: null, records: []}
const keyPrefix = "applauncher-"
const keyMap = {
    GROUPS: 'groups',
    SETTINGS: 'settings'
}

// Hmm, pick between this es6 style class setup or the regular function setup like Record has.
function QueryResult(payload){
    let success = payload.success || false
    let message = payload.message || 'Error generating result.'
    let error = payload.error || 'Error generating the QueryResult Object'
    let records = payload.records || []
    return {success, message, error, records}
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
    console.log(`handling request: ${requestType}, ${JSON.stringify(payload)}`)
    let me = this
    console.log(me.toggleHideAppOnLaunch)
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

StorageInterface.prototype.getHideAppOnLaunchState = function (payload = [], callback){
    settings.get(`${keyMap.SETTINGS}.${hideAppOnLaunch}`)
        .then(result => {
            console.log('hide app state: ', result)
            let queryResult = QueryResult({success: true, message: '', records: [{hide: result}]})
            callback(queryResult)
        })
        .catch(error => {
            let queryResult = QueryResult({success: false, message: 'Error retrieving hide state.', error: 'Error retrieving hide state :/'})
            console.error(chalk.red(new Error(queryResult)))
            callback(queryResult)
        })
}

StorageInterface.prototype.toggleHideAppOnLaunch = function (hide, callback){
    settings.set(`${keyMap.SETTINGS}.hideAppOnLaunch`, hide)
        .then(result => {
            let queryResult = QueryResult({success: true, message: `App will ${hide === true ? 'hide' : 'show'} when launched.`})
            console.log(queryResult)
            callback(queryResult)
        })
        .catch(error => {
            let queryResult = QueryResult({success: false, message: 'Error storing hide state.', error: 'Error storing hide state :/'})
            console.error(chalk.red(new Error(queryResult)))
            callback(queryResult)
        })
}

StorageInterface.prototype.getAllGroups = function(payload, callback){
    settings.get(keyMap.GROUPS)
        .then(result => {
            if(result !== undefined){
                let queryResult = QueryResult({success: true, message: 'All groups retrieved.', error: null, records: Object.keys(result).map((key) => result[key]) })
                callback(queryResult)
            } else {
                // I don't know why I even need check for this. it seems like if there was an error with retrieving the data, the
                // electron-settings package should have rejected instead of resolving. Circle back and dig into what's going on.
                callback(QueryResult({error: 'Package error. ElectronSettings was not able to get the groups. Most likely the groups key does not exist.', message: 'Error retrieving groups.'}))
            }
        })
        .catch(error => {
            let queryResult = new QueryResult({error: error, message: 'Unable to retreive groups.'})
            console.error(chalk.red(new Error(queryResult)))
            callback(queryResult)
        })
}

StorageInterface.prototype.deleteGroup = function(record, callback){
    let queryResult

    if(!record.id){
        queryResult = QueryResult({error: "The record id wasn't provided." , message: 'Internal key error.'})
        console.error(chalk.red(queryResult))
        callback(queryResult)
    }

    settings.delete(`${keyMap.GROUPS}.${record.id}`)
        .then(result => {
            queryResult = QueryResult({success: true, message: 'Group deleted.'})
            callback(queryResult)
        })
        .catch(error => {
            queryResult = QueryResult({error: "Couldn't delete the group for some reason.", message: 'Error deleting group.'})
            console.error(chalk.red(queryResult))
            callback(queryResult)
        })
}


StorageInterface.prototype.upsertGroup = function(record, callback){
    if(!record.id){
        let queryResult = QueryResult({error: "The record id wasn't provided.", message: 'Internal key error.'})
        console.error(chalk.red(queryResult));
        callback(queryResult)
    }


    settings.set(`${keyMap.GROUPS}.${record.id}`, record)
        .then(result =>{
            queryResult = QueryResult({success: true, message: 'Changes saved.'})
            callback(queryResult)
        })
        .catch(error =>{
            queryResult = QueryResult({error: "Error while trying to save the group.", message: 'Error while attempting to save the group.'})
            console.error(chalk.red(queryResult));
            callback(queryResult)
        })
}
