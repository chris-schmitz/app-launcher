<template>
    <div class="app-launcher">
        <h1>App Launcher</h1>
        <div class="content-container">
            <div v-if="currentView === 'groupList'">This is a placeholder for the group list component.</div>
            <div v-if="currentView === 'editGroup'">This is a placeholder for the edit group component.</div>
        </div>
        <div class="actions">
            <button @click="createNewGroup">New Group</button>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data(){
            return {
                currentView: 'groupList'
            }
        },
        methods:{
            createNewGroup(){
                this.currentView = 'editGroup'
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
        // justify-content: space-between;
        // align-items: stretch;


        > h1 {
            margin: 0 0 10px 0;
        }

        .content-container{
            flex: 1;
            border: 1px solid $background;
            padding: 5px;
        }

        .actions{
            display:flex;
            justify-content: center;
        }
    }
</style>
