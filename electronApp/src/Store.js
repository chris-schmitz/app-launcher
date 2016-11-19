const ipc = require('electron').ipcRenderer
const appConfig = require('../appConfig')
const {Storage, Record} = require('../../lib/LocalStorage')

let store = {
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
    },
    showNotification(message, type){
        this.state.notification.message = message
        this.state.notification.type = type
        setTimeout(() => {
            this.state.notification.message = null
            this.state.notification.type = 'info'
        }, 3000)
    },
    loadGroups: function (){
        this.state.groups = Storage.getAll()
    },
    launchGroup: function (group, callback){
        ipc.send('launchGroup', group.name)

        ipc.on('launchGroup-reply', (event, args) => {
            if(args.success){
                callback(`Group "${group.name}" has been launched.`)
            } else {
                callback(`Launch failed: ${args.message}`)
            }
        })
    },
    deleteGroup: function (group){
        Storage.delete(group)
    },
    setContainerView: function (name){
        this.state.groupContainerView = name
    },
    getContainerViewMode:function (){
        return this.state.groupContainerViewMode
    },
    selectGroup: function (id){
        this.state.selectedGroupId = id
    },
    newGroup: function (name = null, launchApps = []){
        if(name === null) throw new Error('You must provide a name for the group')

        return new Record(name, launchApps)
    },
    saveGroup: function (group){
        Storage.upsert(group)
    },
    selectedGroup: function (){
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
