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
        selectedGroupId: null,
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

module.exports.state.loadGroups = function (){
    this.groups = Storage.getAll()
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


module.exports.state.selectGroup = function (id){
    this.selectedGroupId = id
}

module.exports.state.newGroup = function (name = null, launchApps = []){
    if(name === null) throw new Error('You must provide a name for the group')

    return new Record(name, launchApps)
}

module.exports.state.saveGroup = function (group){
    Storage.upsert(group)
}

module.exports.state.selectedGroup = function (){
    let group = this.groups.filter(group => Number(group.id) === Number(this.selectedGroupId))
    return group.length === 0 ? this.newGroup('New Group') : group[0]
}

module.exports.state.getNextGroupId = function (){
    return 10
}
