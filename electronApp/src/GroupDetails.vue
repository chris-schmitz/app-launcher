<template>
    <div class="group-details-container">
        <div>
            <label for="id">ID</label>
            {{ selectedGroup.id }}
            <!-- <input type="text" name="id" v-model="selectedGroup.id"> -->
        </div>
        <div>
            <label for="name">Name</label>
            <input type="text" name="name" v-model="selectedGroup.name">
        </div>
        <div class="app-details">
            <div class="app-list">
                    <h4 class="heading">This group launches the apps:</h4>
                    <ul>
                        <li v-for="app in selectedGroup.launchApps">
                            <span>{{ app }}</span><button>x</button>
                        </li>
                    </ul>
            </div>
            <div class="add-app">
                <div class="drag-and-drop-target">Drop app to add</div>
                <span>or</span>
                <button type="button" @click="showSelectionWindow">Select to Add</button>
            </div>
        </div>
        <!-- <button v-on:click="doneEditing">Back</button> -->
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
            selectedGroup(){
                return Store.state.selectedGroup()
            },
            selectedGroupId: {
                get(){
                    return this.sharedState.selectedGroupId
                },
                set(newValue){
                    this.sharedState.selectGroup(newValue)
                }
            }
        },
        methods:{
            doneEditing(){
                this.sharedState.setContainerView('groupList')
            },
            showSelectionWindow(){

            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "style/_variables.sass";

    .group-details-container{
        flex: 1;
        display:flex;
        flex-direction: column;

        > * {
            border: 1px solid $backgroundDark;
            padding: 10px;
            display: flex;

            label {
                display: inline-block;
                width: 75px;
            }

            input {
                font-size: $fontSize;
                flex: 1;
            }
        }

        .app-details{
            flex: 1;
            // > {border: 1px solid $backgroundDark}

            .app-list{
                border-right: 1px solid $backgroundDark;
                flex: 4;
                display:flex;
                flex-direction: column;
                justify-content: flex-start;
                overflow-y: scroll;


                .heading{
                    margin: 0 0 5px 0;
                }

                ul {
                    margin: 0;
                    margin-right: 10px;
                    padding-left: 0;
                    list-style: none;

                    li {
                        padding: 10px;
                        border: 1px solid $backgroundDark;
                        margin-bottom: 5px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        button {
                            background-color: $highlightDanger;
                        }
                    }
                }
            }

            .add-app {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                span {margin-top:10px; margin-bottom:10px;}

                button {
                    margin-left: 10px;
                    margin-right: 10px;
                }

                .drag-and-drop-target{
                    border: 3px dashed $highlightInfo;
                    height: 100px;
                    width: 100px;
                    background-color: $white;
                    color:$backgroundDark;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
            }
        }

    }
</style>
