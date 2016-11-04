module.exports = {
    state:{
        groupContainerView: 'groupList',
        selectedGroupId: 3,
        setContainerView(name){
            this.groupContainerView = name
        },
        selectGroup(id){
            this.selectedGroupId = id
        },
        selectedGroup(){
            return this.groups.filter(group => Number(group.id) === Number(this.selectedGroupId))
        },
        groups: [
            {
                id: 1,
                name: 'Development - Work',
                launchApps:[
                    '/Applications/Slack.app',
                    '/Applications/iTerm.app'
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
