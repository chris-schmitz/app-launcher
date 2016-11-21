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
        let me = this // I _shouldn't_ have to do this if I change this to an arrow function, but for some reason it doesn't retain context
        Storage.getAll((result) => {
            // this should become an app notification
            if(!result.success) throw new Error(result.error)
            me.state.groups = result.records
        })
    },
    launchGroup(group, callback){
        console.log('launching group')
        ipc.send('launchGroup', group.name)

        ipc.on('launchGroup-reply', (event, args) => {
            if(args.success){
                callback(`Group "${group.name}" has been launched.`)
            } else {
                callback(`Launch failed: ${args.message}`)
            }
        })
    },
    deleteGroup(group){
        Storage.delete(group)
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
        ipc.send('storageRequest','upsert', group, (result) => {
            alert(JSON.stringify(result))
        })

        ipc.on('storageRequest-reply', (event, eventResult) => {
            debugger
            if(eventResult.success){
                this.showNotification('Changes Saved.', 'success')
                this.setContainerView('groupList')
            } else {
                this.showNotification(`There was an error saving the group: ${eventResult.error}`, 'danger')
            }

        })
    },
    selectedGroup(){
        let group = this.state.groups.filter(group => Number(group.id) === Number(this.state.selectedGroupId))
        if(group.length === 0 ) throw new Error('Unable to select the group.')
        return group[0]
    }
}

module.exports = store

// ===============

ipc.on('groupLaunched', (event, launchResult) => {
    if(launchResult.success){
        store.state.notification.type = "success"
    } else {
        store.state.notification.type = "danger"

    }
    store.state.notification.message = `Group "${launchResult.groupName}" launched.`
})
