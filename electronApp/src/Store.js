module.exports = {
    state:{
        groupContainerView: 'groupDetails',
        // groupContainerView: 'groupList',
        selectedGroupId: 1,
        dropTargetActive: false,
        setContainerView(name){
            this.groupContainerView = name
        },
        selectGroup(id){
            this.selectedGroupId = id
        },
        newGroup(name = null, launchApps = []){
            return {id: this.getNextGroupId(), name, launchApps}
        },
        deleteGroup(group){
            alert('deleted!')
        },
        saveGroup(group){
            alert('saved!!')
        },
        selectedGroup(){
            return this.groups
                .filter(group => Number(group.id) === Number(this.selectedGroupId))
                .reduce(group => group ? group : this.newGroup())
        },
        getNextGroupId(){
            return 10
        },
        groups: [
            {
                id: 1,
                name: 'Development - Work',
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
                id: 1,
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
