const {LocalStorage} = require('./storageTypes/localStorage')
const settings = require('electron-settings')
const co = require('co')
const chalk = require('chalk')

const ipc = require('electron').ipcMain


let queryResult = {success: false, message: null, error: null, records: []}
const keyPrefix = "applauncher-"
const keyMap = {
    GROUPS: 'groups',
    SETTINGS: 'settings'
}


// The methods of the StorageInterface are called dynamically by name via the `handleRequest`
// method. the names of the methods below should match their keys here so that the
// updated names can be accessed safely by outside files without having to hard
// code the names as strings in those external files.
const StorageActions = {
    GETALLGROUPS: 'getAllGroups',
    TOGGLEHIDEAPPONLAUNCH: 'toggleHideAppOnLaunch',
    GETHIDEAPPONLAUNCHSTATE: 'getHideAppOnLaunchState',
    UPSERTGROUP: 'upsertGroup',
    DELETEGROUP: 'deleteGroup',
    INITIALIZESTORAGE: 'initializeStorage'
}

// Hmm, pick between this es6 style class setup or the regular function setup like Record has.
function QueryResult(payload){
    let success = payload.success || false
    let message = payload.message || ''
    let error = payload.error || ''
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
    StorageActions
}

StorageInterface.prototype.handleRequest = function (requestType, payload = []){
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

StorageInterface.prototype.getHideAppOnLaunchState = function (payload = [], callback){
    settings.get(`${keyMap.SETTINGS}.hideAppOnLaunch`)
        .then(result => {
            console.log('hide app state: ', result)
            let queryResult = QueryResult({success: true, message: '', records: [{hide: result}]})
            callback(queryResult)
        })
        .catch(error => {
            let queryResult = QueryResult({success: false, message: 'Error retrieving hide state.', error: 'Error retrieving hide state :/'})
            console.error(new Error(chalk.red(queryResult)))
            callback(queryResult)
        })
}

StorageInterface.prototype.toggleHideAppOnLaunch = function (hide, callback){
    settings.set(`${keyMap.SETTINGS}.hideAppOnLaunch`, hide)
        .then(result => {
            let queryResult = QueryResult({success: true, message: `App will ${hide === true ? 'hide' : 'show'} when launched.`})
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
                let queryResult = QueryResult({success: true, records: Object.keys(result).map((key) => result[key]) })
                callback(queryResult)
            } else {
                // I don't know why I even need check for this. it seems like if there was an error with retrieving the data, the
                // electron-settings package should have rejected instead of resolving. Circle back and dig into what's going on.
                callback(QueryResult({error: 'Package error. ElectronSettings was not able to get the groups. Most likely the groups key does not exist.', message: 'Error retrieving groups.'}))
            }
        })
        .catch(error => {
            let queryResult = QueryResult({error: error, message: 'Unable to retreive groups.'})
            console.error(new Error(chalk.red(`${queryResult}`)))
            callback(queryResult)
        })
}

StorageInterface.prototype.deleteGroup = function(record, callback){
    let queryResult

    if(!record.id){
        queryResult = QueryResult({error: "The record id wasn't provided." , message: 'Internal key error.'})
        console.error(new Error(chalk.red(queryResult)))
        callback(queryResult)
    }

    settings.delete(`${keyMap.GROUPS}.${record.id}`)
        .then(result => {
            queryResult = QueryResult({success: true, message: 'Group deleted.'})
            callback(queryResult)
        })
        .catch(error => {
            queryResult = QueryResult({error: "Couldn't delete the group for some reason.", message: 'Error deleting group.'})
            console.error(new Error(chalk.red(queryResult)))
            callback(queryResult)
        })
}

StorageInterface.prototype.upsertGroup = function(record, callback){
    if(!record.id){
        let queryResult = QueryResult({error: "The record id wasn't provided.", message: 'Internal key error.'})
        console.error(new Error(chalk.red(queryResult)))
        callback(queryResult)
    }


    settings.set(`${keyMap.GROUPS}.${record.id}`, record)
        .then(result =>{
            queryResult = QueryResult({success: true, message: 'Changes saved.'})
            callback(queryResult)
        })
        .catch(error =>{
            queryResult = QueryResult({error: "Error while trying to save the group.", message: 'Error while attempting to save the group.'})
            console.error(new Error(chalk.red(queryResult)))
            callback(queryResult)
        })
}

StorageInterface.prototype.initializeStorage = function (record, callback){
    console.log(chalk.green('initilizing storage'))
    co(function *(){
        let groupResult = "Groups already exist"
        let generalSettingsResult = "General settings already exist"

        let groups = yield settings.get(keyMap.GROUPS)
        let appSettings = yield settings.get(keyMap.SETTINGS)

        if(groups === undefined || Object.keys(groups).length === 0){
            groupResult = yield initializeGroupsSettings()
        }

        if(appSettings === undefined || Object.keys(appSettings) === 0){
            generalSettingsResult = yield initizeGeneralSettings()
        }

        let queryResult = QueryResult({
            success: true,
            records: [{groupResult, generalSettingsResult}]
        })
        callback(queryResult)
    })
    .catch(error => {
        console.error(new Error(chalk.red(error)))
        callback(QueryResult({error}))
    })
}


// We don't need to put these in the StorageInterface object b/c they're really
// private methods so we can mask them from the module export. Really, most of
// the methods of the storage interface _should_ be used as private methods as
// we're passing all requests through the `handleRequest` method. Consider refactoring
// all of the private methods this way.
function initializeGroupsSettings(){
    return new Promise(function(resolve, reject) {
        settings.set(keyMap.GROUPS, {})
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

function initizeGeneralSettings(){
    return new Promise(function(resolve, reject) {
        settings.set(keyMap.SETTINGS, {hideAppOnLaunch: false})
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}
