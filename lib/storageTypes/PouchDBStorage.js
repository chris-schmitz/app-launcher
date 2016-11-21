const PouchDB = require('pouchdb')
let db = new PouchDB('../../pouchStorage')

let queryResult = {success: false, error: null, records: []}
// function Result(success, error, records){
//     return {success, error, records}
// }

function PouchDbStorage(){}

module.exports.PouchDbStorage = PouchDbStorage

PouchDbStorage.getAll = function(callback){
    db.allDocs()
        .then(result => {
            if(result.total_rows > 0){
                queryResult.records = result.rows
            }
            queryResult.success = true
            callback(queryResult)
        })
        .catch(error => {
            queryResult.error = error
            callback(queryResult)
        })
}

PouchDbStorage.save = function(record){
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

PouchDbStorage.delete = function(record){
    if(!record.id) throw new Error('Internal key error.')

    return db.remove(record.id)
}

PouchDbStorage.getById = function(id){
    if(!id) throw new Error('Internal key error.')
    if(localStorage.getItem(id)) throw new Error('There is no record with this key.')

    this._getItem(id)
}


PouchDbStorage.upsert = function(record, callback){
    if(!record.id) throw new Error('Internal key error.')

    debugger
    // what does result hold at this point?
    db.put(record)
        .then(result =>{
            debugger
            queryResult.success = true
            // what else does result have at this point?
            callback(queryResult)
        })
        .catch(error =>{
            debugger
            queryResult.error = error
            callback(queryResult)
        })
}

PouchDbStorage._setItem = function(record){
    localStorage.setItem(record.id, JSON.stringify(record))
}

PouchDbStorage._deleteItem = function(record){
    localStorage.removeItem(record.id)
}

PouchDbStorage._getItem = function(id){
    return JSON.parse(localStorage.getItem(id))
}
