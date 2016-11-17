const appConfig = require('../electronApp/appConfig')
const storageKeyPrefix = `${appConfig.localStorageKey}-`

module.exports.Record = (name = null, launchApps = []) => {
    let key = storageKeyPrefix + Number(new Date())
    return {key, name, launchApps}
}

function Storage(){}

module.exports.Storage = Storage

Storage.getAll = function(){
    if( localStorage.length === 0){
        return []
    }
    return Object
            .keys(localStorage)
            .map(key => localStorage.getItem(key))
            .map(value => JSON.parse(value))
}

Storage.save = function(record){
    if(!record.key) throw new Error('Internal key error.')
    if(localStorage.getItem(record.key)) throw new Error('A record with this key already exists.')

    this._setItem(record)
}

Storage.delete = function(record){
    if(!record.key) throw new Error('Internal key error.')
    if(!localStorage.getItem(record.key)) throw new Error('There is no record with this key.')

    this._deleteItem(record)
}

Storage.get = function(record){
    if(!record.key) throw new Error('Internal key error.')
    if(localStorage.getItem(record.key)) throw new Error('There is no record with this key.')

    this._getItem(record)
}


Storage.upsert = function(record){
    if(!record.key) throw new Error('Internal key error.')

    this._setItem(record)
}



Storage._setItem = function(record){
    localStorage.setItem(record.key, JSON.stringify(record))
}

Storage._deleteItem = function(record){
    localStorage.removeItem(record.key)
}

Storage._getItem = function(record){
    return JSON.parse(localStorage.getItem(record.key))
}
