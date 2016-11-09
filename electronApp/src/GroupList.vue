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
                <button @click="launchGroup(group)" class="launch-action">Launch</button>
                <button v-on:click="editGroup(group.id)" class="edit-action">Edit</button>
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
            },
            notificationMessage:{
                get(){
                    return this.sharedState.notificationMessage
                },
                set(message){
                    this.sharedState.notificationMessage = message
                }
            }
        },
        methods:{
            editGroup(id){
                this.sharedState.selectGroup(id)
                this.sharedState.setContainerView('groupDetails')
            },
            launchGroup(group){
                this.sharedState.launchGroup(group, (result) => {
                    this.notificationMessage = result
                })
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "./style/_variables.sass";
    @import "./style/_mixins.sass";

    .group-list-container{

        .group{
            background-color: orange;
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
                overflow-y: scroll;
                line-height: 1.5;

                &::-webkit-scrollbar {
                    display: block;
                    width: 12px;
                }

                &::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 6px $backgroundDark;
                    border-radius: 10px;
                }

                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
                }

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
                    @include regular-button($highlightInfo, $white)
                }
                .delete-action{
                    @include regular-button($highlightDanger, $white)
                }
                .launch-action{
                    @include regular-button($highlightSuccess, $white)
                }
                .spacer{
                    height: 10px;
                    border: none;
                }
            }
        }
    }
</style>
