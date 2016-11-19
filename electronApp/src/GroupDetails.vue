// holy cow break this up into nested components :O


<template>
    <div class="group-details-container">
        <div>
            <label for="name">Group Name</label>
            <input type="text" name="name" v-model="selectedGroup.name">
        </div>
        <div class="app-details">
            <div class="app-list">
                    <h4 class="heading">This group launches the apps:</h4>
                    <app-list></app-list>
            </div>
            <app-adder class="add-app"></app-adder>
        </div>
        <div class="actions">
            <button @click="deleteGroup" class="deleteButton">Delete</button>
            <div>
                <button @click="backToGroupList" class="backButton">Back</button>
                <button @click="saveGroup" class="saveButton">{{ containerViewMode === 'new' ? "Save" : "Update" }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import store from './Store'
    import AppList from './AppList.vue'
    import AppAdder from './AppAdder.vue'

    module.exports = {
        components:{AppList, AppAdder},
        data(){
            return {
                sharedState: store.state
            }
        },
        computed:{
            containerViewMode(){
                return store.getContainerViewMode()
            },
            selectedGroup(){
                return store.selectedGroup()
            },
            selectedGroupId: {
                get(){
                    return this.sharedState.selectedGroupId
                },
                set(newValue){
                    store.selectGroup(newValue)
                }
            },
        },
        methods:{
            doneEditing(){
                store.setContainerView('groupList')
            },
            makeDropTargetActive(state){
                this.dropTargetActive = state
            },
            deleteGroup(){
                store.deleteGroup(this.selectedGroup)
                this.backToGroupList()
            },
            saveGroup(){
                store.saveGroup(this.selectedGroup)
                this.backToGroupList()
            },
            backToGroupList(){
                // confirm
                store.loadGroups()
                store.setContainerView('groupList')
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "style/_variables.sass";
    @import "style/_mixins.sass";

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
                width: 130px;
                display: flex;
                align-items: center;
                text-align: center;
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
                flex: 3;
            }

            .add-app {
                flex: 1;
            }
        }

        .actions{
            display: flex;
            justify-content: space-between;
            button{width:100px;}
            .deleteButton{ @include regular-button($highlightDanger, $white); }
            .saveButton{ @include regular-button($highlightSuccess, $white); }
        }

        .dropTargetActive {
            color: $highlightInfo !important;
            border-style: solid !important;
        }
    }
</style>
