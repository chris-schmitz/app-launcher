// Once you've successfully extracted all of the store information and
// functionality out of the existing `Store.js` file, delete Store.js and rename
// This file to Store.js

const Vue = require('vue')
const Vuex = require('vuex')

Vue.use(Vuex)

module.exports = new Vuex.Store({
    state: {
        // groupContainerView: 'groupDetails',
        groupContainerView: 'groupList',
        selectedGroupId: 1,
        dropTargetActive: false,
        notification: {
            type: 'info',
            message: null
        },
        groups: []
    }
})
