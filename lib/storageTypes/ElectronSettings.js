const settings = require('electron-settings')
const chalk = require('chalk')

let queryResult = {success: false, message: null, error: null, records: []}
const keyMap = {
    GROUPS: 'groups',
}

function ElectronSettings(){}

module.exports.ElectronSettings = ElectronSettings

ElectronSettings.getAllGroups = function(callback){
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

ElectronSettings.deleteGroup = function(record, callback){
    if(!record.id) throw new Error('Internal key error.')

    // These are starting to look similar, consider abstracting to
    // a handler function

    settings.delete(`${keyMap.GROUPS}.${record.id}`)
        .then(result => {
            queryResult.success = true
            queryResult.message = "Group deleted."
            callback(queryResult)
        })
        .catch(error => {
            queryResult.error = error
            queryResult.message = "Error deleting group."
        })
}


ElectronSettings.upsertGroup = function(record, callback){
    if(!record.id) throw new Error('Internal key error.')

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
