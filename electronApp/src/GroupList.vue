<template>
    <div class="group-list-container">
        <div class="group" v-for="group in groups">
            <h4 class="group-name">{{ group.name }}</h4>
            <div class="app-list-container">
                <h4 class="launches-title">Launches:</h4>
                <ul class="app-list">
                    <li v-for="app in group.launchApps">{{ app }}</li>
                </ul>
            </div>
            <div class="actions-container">
                <button class="launch-action">Launch</button>
                <div class="spacer"></div>
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


        .group{
            border: 1px solid $backgroundDark;
            // border: 1px solid $background;
            background-color: $background;
            height: 150px;
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
                text-align: center;
                width: 150px;
                background-color: $backgroundDark;
                // border: 1px solid $backgroundDark;
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
                    font-size:10pt;
                    // padding: 20px;
                    text-align: center;
                    // display: flex;
                    // justify-content: center;
                    // align-items: center;
                }

                .edit-action{
                    background-color: $highlightInfo;
                }
                .delete-action{
                    background-color: $highlightDanger;
                }
                .launch-action{
                    background-color: $highlightSuccess;
                }
                .spacer{
                    height: 10px;
                    border: none;
                }
            }
        }
    }
</style>
