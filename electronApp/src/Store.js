const ipc = require('electron').ipcRenderer

module.exports = {
    state:{
        // groupContainerView: 'groupDetails',
        groupContainerView: 'groupList',
        selectedGroupId: 1,
        dropTargetActive: false,
        notificationMessage: null,
        groups: []
    }
}


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

module.exports.state.selectGroup = function (id){
    this.selectedGroupId = id
}

module.exports.state.newGroup = function (name = null, launchApps = []){
    return {id: this.getNextGroupId(), name, launchApps}
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
