const settings = require('electron-settings')

let queryResult = {success: false, message: null, error: null, records: []}

function ElectronSettings(){}

module.exports.ElectronSettings = ElectronSettings

ElectronSettings.getAll = function(callback){
    settings.get()
        .then(result => {
            queryResult.success = true
            queryResult.message = 'All groups retrieved.'
            queryResult.records = Object.keys(result)
                .map((key) => {
                    return result[key]
                })
            callback(queryResult)
        })
        .catch(error => {
            queryResult.error = error
            callback(queryResult)
        })
}

// ElectronSettings.save = function(record){
//     if(!record.id) throw new Error('Internal key error.')
//
//     return db.put(record)
//             .then(result => {
//                 debugger
//                 return result
//             })
//             .catch(error => {
//                 debugger
//                 return error
//             })
// }

ElectronSettings.delete = function(record, callback){
    if(!record.id) throw new Error('Internal key error.')

    // These are starting to look similar, consider abstracting to
    // a handler function

    settings.delete(record.id)
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

ElectronSettings.getById = function(id){
    if(!id) throw new Error('Internal key error.')

    settings.get(id)
        .then( )

    if(localStorage.getItem(id)) throw new Error('There is no record with this key.')

    this._getItem(id)
}


ElectronSettings.upsert = function(record, callback){
    if(!record.id) throw new Error('Internal key error.')

    settings.set(`${record.id}`, record)
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
