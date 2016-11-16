const ipc = require('electron').ipcRenderer
const appConfig = require('../appConfig')
const {Storage, Record} = require('../../lib/LocalStorage')


// Refactor this whole crazy thing

let store  = {
    state:{
        // groupContainerView: 'groupDetails',
        groupContainerView: 'groupList',
        // refactor to put these two together
        groupContainerViewMode: 'new',
        selectedGroupId: 1,
        dropTargetActive: false,
        notification: {
            type: 'info',
            message: null
        },
        groups: []
    }
}

module.exports = store

ipc.on('groupLaunched', (event, launchResult) => {
    if(launchResult.success){
        store.state.notification.type = "success"
    } else {
        store.state.notification.type = "danger"

    }
    store.state.notification.message = `Group "${launchResult.groupName}" launched.`
})

ipc.on('ShowAboutPage', () => {
    alert('show about fired in store')
    store.state.notification.message = 'Show about page'
})

// ipc.on('tray-launchGroup', function(event, group) {
//     this.state.launchGroup(group, (message) => {
//         this.notificationMessage = message
//     })
// })


/*
    This doesn't seem great. Consider refactoring
 */

module.exports.state.loadGroups = function (){
    ipc.send('loadGroups')
    ipc.on('loadGroups-reply', (event, args) => {
        if(args.success){
            this.groups = args.groups
        } else {
            this.notificationMessage = "Error loading groups"
        }
    })
}

module.exports.state.launchGroup = function (group, callback){
    ipc.send('launchGroup', group.name)

    ipc.on('launchGroup-reply', (event, args) => {
        if(args.success){
            callback(`Group "${group.name}" has been launched.`)
        } else {
            callback(`Launch failed: ${args.message}`)
        }
    })
}

module.exports.state.deleteGroup = function (group){
    alert(`Deleted ${this.selectedGroup().name}`)
}

module.exports.state.setContainerView = function (name){
    this.groupContainerView = name
}

module.exports.state.getContainerViewMode = function (){
    return this.groupContainerViewMode
}

module.exports.state.setContainerViewMode = function (mode){
    this.groupContainerViewMode = mode
}

module.exports.state.selectGroup = function (id){
    this.selectedGroupId = id
}

module.exports.state.newGroup = function (name = null, launchApps = []){
    debugger
    if(name === null) throw new Error('You must provide a name for the group')

    let record = new Record(name, launchApps)
    storage.save(record)
    console.log(record)
}

module.exports.state.saveGroup = function (group){
    alert('saved!!')
}

module.exports.state.selectedGroup = function (){
    return this.groups
        .filter(group => Number(group.id) === Number(this.selectedGroupId))
        .reduce(group => group ? group : this.newGroup())
}

module.exports.state.getNextGroupId = function (){
    return 10
}
