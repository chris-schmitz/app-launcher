<template>
    <div class="group-list-container">
        <div class="group" v-for="group in groups">
            <h3 class="group-name">{{ group.name }}</h3>
            <div class="app-list-container">
                <h4 class="launches-title">Launches:</h4>
                <ul class="app-list">
                    <li v-for="app in group.launchApps">{{ app }}</li>
                </ul>
            </div>
            <div class="actions-container">
                <button v-on:click="editGroup(group.id)" class="edit-action">Edit</button>
                <button class="delete-action">Delete</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Store from './Store'
    module.exports = {
        data(){
            return {
                sharedState: Store.state
            }
        },
        computed:{
            groups(){
                return this.sharedState.groups
            }
        },
        methods:{
            editGroup(id){
                this.sharedState.selectGroup(id)
                this.sharedState.setContainerView('groupDetails')
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "./style/_variables.sass";
    .group-list-container{
        // display: flex;
        // flex-direction: column;


        .group{
            background-color: $background;
            // flex: 1;
            height: 150px;
            border: 1px solid $background;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;

            > * {
                margin: 5px;
                padding: 10px;
            }

            .launches-title {
                margin: 0;
            }


            .group-name{
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 150px;
            }

            .app-list-container{
                flex: 1;

                .app-list  {
                    font-size:12pt;
                    margin: 1.5px;
                }
            }

            .actions-container{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;

                > * {
                    border: 1px solid $backgroundDark;
                    width: 100px;
                    padding: 20px;
                    text-align: center;
                }

                .edit-action{
                    background-color: $highlightSuccess;
                }
            }
        }
    }
</style>
