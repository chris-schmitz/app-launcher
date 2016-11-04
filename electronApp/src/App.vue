<template>
    <div class="app-launcher">
        <h1>App Launcher</h1>
        <div class="content-container">
            <group-list class="group-list-wrapper" v-if="currentView === 'groupList'"></group-list>
            <group-details v-if="currentView === 'groupDetails'"></group-details>
        </div>
        <div class="actions">
            <button @click="createNewGroup">New Group</button>
        </div>
    </div>
</template>

<script>
    import Store from './Store'
    import GroupList from './GroupList.vue'
    import GroupDetails from './GroupDetails.vue'

    module.exports = {
        components:{GroupList,GroupDetails},
        data(){
            return {
                sharedState: Store.state
                // currentView: 'groupDetails'
            }
        },
        computed:{
            currentView(){
                return this.sharedState.groupContainerView
            }
        },
        methods:{
            createNewGroup(){
                this.currentView = 'groupDetails'
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "./style/_variables.sass";

    .app-launcher{
        display:flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 20px;

        > h1 {
            margin: 0 0 10px 0;
        }


        .content-container{
            flex: 1;
            border: 1px solid $background;
            padding: 5px;
            display: flex;
            flex-direction:column;
            justify-content: center;
            align-items: stretch;
            overflow:hidden;
        }

        .group-list-wrapper{
            overflow-y: auto;
        }

        ::-webkit-scrollbar {
            display: none;
        }

        .actions{
            display:flex;
            justify-content: center;
            margin-top: 10px;
        }
    }
</style>
