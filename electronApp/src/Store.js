const ipc = require('electron').ipcRenderer
const appConfig = require('../appConfig')
const {Storage, Record} = require('../../lib/StorageInterface')


let store = {
    state:{
        // groupContainerView: 'groupDetails',
        groupContainerView: 'groupList',
        // refactor to put these two together
        selectedGroupId: null,
        dropTargetActive: false,
        notification: {
            type: 'info',
            message: null
        },
        groups: []
    },
    showNotification(message, type){
        this.state.notification.message = message
        this.state.notification.type = type
        setTimeout(() => {
            this.state.notification.message = null
            this.state.notification.type = 'info'
        }, 3000)
    },
    loadGroups(){
        ipc.send('storageRequest', 'getAllGroups')
    },
    launchGroup(group, callback){
        ipc.send('launchGroup', group.name)

        ipc.on('launchGroup-reply', (event, args) => {
            if(args.success){
                callback(`Group "${group.name}" has been launched.`)
                // this.state.groups = args.records
            } else {
                callback(`Launch failed: ${args.message}`)
            }
        })
    },
    deleteGroup(group){
        ipc.send('storageRequest', 'deleteGroup', group)
    },
    setContainerView(name){
        this.state.groupContainerView = name
    },
    getContainerViewMode:function (){
        return this.state.groupContainerViewMode
    },
    selectGroup(id){
        this.state.selectedGroupId = id
    },
    newGroup(name = null, launchApps = []){
        if(name === null) throw new Error('You must provide a name for the group')

        return new Record(name, launchApps)
    },
    saveGroup(group, callback){
        ipc.send('storageRequest','upsertGroup', group)
    },
    selectedGroup(){
        let group = this.state.groups.filter(group => group.id === this.state.selectedGroupId)
        if(group.length === 0 ) throw new Error('Unable to select the group.')
        return group[0]
    }
}

module.exports = store

ipc.on('storageRequest-reply', (event, eventResult) => {
    console.log('storage request reply received!')
    if(eventResult.success){
        store.showNotification(eventResult.message, 'success')

        // note that in this app, all of the places where we'd persist data happen from the
        // group details component and should trigger the activation of the group list component,
        // so hard coding it here instead of handling it dynamically like we would
        store.setContainerView('groupList')
        console.log('in storage request reply')
        console.log(JSON.stringify(eventResult))
        if(eventResult.requestedAction !== 'getAllGroups'){
            store.loadGroups()
        } else {
            store.state.groups = eventResult.records
        }
    } else {
        store.showNotification(`There was an error saving the group: ${eventResult.error}`, 'danger')
    }

})
// ===============

ipc.on('groupLaunchedFromTray', (event, launchResult) => {
    console.log('group launched reply ')
    if(launchResult.success){
        store.state.notification.type = "success"
    } else {
        store.state.notification.type = "danger"

    }
    store.state.notification.message = `Group "${launchResult.groupName}" launched.`
})
