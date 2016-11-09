const ipc = require('electron').ipcRenderer

module.exports = {
    state:{
        // groupContainerView: 'groupDetails',
        groupContainerView: 'groupList',
        selectedGroupId: 1,
        dropTargetActive: false,
        groups: [
            {
                id: 1,
                name: 'work',
                launchApps:[
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app',
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app',
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app',
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app',
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app',
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app',
                ]
            },
            {
                id: 2,
                name: 'Development - Personal',
                launchApps:[
                    '/Applications/Atom.app',
                    '/Applications/iTerm.app'
                ]
            },
            {
                id: 3,
                name: 'Development - Personal Again',
                launchApps:[
                    '/Applications/Atom.app',
                    '/Applications/iTerm.app'
                ]
            },
            {
                id: 4,
                name: 'Design',
                launchApps:[
                    '/Applications/Phototshop.app',
                    '/Applications/Illustrator.app'
                ]
            }
        ]
    }
}


/*
    This doesn't seem great. Consider refactoring
 */

module.exports.state.launchGroup = function (group){
    ipc.send('launchGroup', group.name)
}

ipc.on('launchGroup-reply', (event, args) => {
    if(args.success){
        alert(`launch reply received with args: ${JSON.stringify(args.message)}`)
    } else {
        alert(`Launch failed: ${args.message}`)
    }
})


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
