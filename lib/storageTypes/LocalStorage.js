

function LocalStorage(){}

module.exports.LocalStorage = LocalStorage

LocalStorage.getAll = function(){
    if( localStorage.length === 0){
        return []
    }
    return Object
            .keys(localStorage)
            .map(key => localStorage.getItem(key))
            .map(value => JSON.parse(value))
}

LocalStorage.save = function(record){
    if(!record.id) throw new Error('Internal key error.')
    if(localStorage.getItem(record.id)) throw new Error('A record with this key already exists.')

    this._setItem(record)
}

LocalStorage.delete = function(record){
    if(!record.id) throw new Error('Internal key error.')
    if(!localStorage.getItem(record.id)) throw new Error('There is no record with this key.')

    this._deleteItem(record)
}

LocalStorage.getById = function(id){
    if(!id) throw new Error('Internal key error.')
    if(localStorage.getItem(id)) throw new Error('There is no record with this key.')

    this._getItem(id)
}


LocalStorage.upsert = function(record){
    if(!record.id) throw new Error('Internal key error.')

    this._setItem(record)
}

LocalStorage._setItem = function(record){
    localStorage.setItem(record.id, JSON.stringify(record))
}

LocalStorage._deleteItem = function(record){
    localStorage.removeItem(record.id)
}

LocalStorage._getItem = function(id){
    return JSON.parse(localStorage.getItem(id))
}
