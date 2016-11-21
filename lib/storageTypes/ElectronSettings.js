const settings = require('electron-settings')

let queryResult = {success: false, error: null, records: []}

function ElectronSettings(){}

module.exports.ElectronSettings = ElectronSettings

ElectronSettings.getAll = function(callback){
    settings.get()
        .then(result => {
            queryResult.success = true
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

ElectronSettings.save = function(record){
    if(!record.id) throw new Error('Internal key error.')

    return db.put(record)
            .then(result => {
                debugger
                return result
            })
            .catch(error => {
                debugger
                return error
            })
}

ElectronSettings.delete = function(record){
    if(!record.id) throw new Error('Internal key error.')

    return db.remove(record.id)
}

ElectronSettings.getById = function(id){
    if(!id) throw new Error('Internal key error.')
    if(localStorage.getItem(id)) throw new Error('There is no record with this key.')

    this._getItem(id)
}


ElectronSettings.upsert = function(record, callback){
    if(!record.id) throw new Error('Internal key error.')

    settings.set(`${record.id}`, record)
        .then(result =>{
            queryResult.success = true
            // what else does result have at this point?
            callback(queryResult)
        })
        .catch(error =>{
            queryResult.error = error
            callback(queryResult)
        })
}

ElectronSettings._setItem = function(record){
    localStorage.setItem(record.id, JSON.stringify(record))
}

ElectronSettings._deleteItem = function(record){
    localStorage.removeItem(record.id)
}

ElectronSettings._getItem = function(id){
    return JSON.parse(localStorage.getItem(id))
}
