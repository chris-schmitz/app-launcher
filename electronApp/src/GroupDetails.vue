<template>
    <div class="group-details-container">
        <div>
            <label for="name">Group Name</label>
            <input type="text" name="name" v-model="selectedGroup.name">
        </div>
        <div class="app-details">
            <app-list class="app-list"></app-list>
            <app-adder class="add-app"></app-adder>
        </div>
        <div class="actions">
            <button @click="deleteGroup" class="deleteButton">Delete</button>
            <div>
                <button @click="backToGroupList" class="backButton">Back</button>
                <button @click="saveGroup" class="saveButton">{{ containerViewMode === 'new' ? "Save" : "Update" }}</button>
            </div>
        </div>
        <modal v-if="confirmationMessage">
            <span slot="message">
                {{ confirmationMessage }}
            </span>
            <div slot="buttons">
                <div class="button-container">
                    <button @click="cancelGroupDeletion" class="cancel">No</button>
                    <button @click="confirmGroupDeletion" class="confirm">Yes</button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    let store = require('./Store')
    let AppList = require('./AppList.vue')
    let AppAdder = require('./AppAdder.vue')
    let Modal = require('./Modal.vue')

    module.exports = {
        components:{AppList, AppAdder, Modal},
        data(){
            return {
                sharedState: store.state,
                confirmationMessage: null
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
                this.confirmationMessage = "Are you sure you want to delete this group?"
            },
            saveGroup(){
                store.saveGroup(this.selectedGroup, (result) => {
                    if(result.success){
                        store.showNotification(`Changes to group ${this.selectedGroup.name} saved.`, 'info')
                        this.backToGroupList()
                    } else {
                        store.showNotification(`Unable to save changes to group ${this.selectedGroup.name}.`, 'danger')
                    }
                })
            },
            backToGroupList(){
                store.loadGroups()
                store.setContainerView('groupList')
            },
            cancelGroupDeletion(){
                this.confirmationMessage = null
            },
            confirmGroupDeletion(){
                this.confirmationMessage = null
                store.showNotification(`Group ${this.selectedGroup.name} deleted.`, 'info')
                store.deleteGroup(this.selectedGroup)
                this.backToGroupList()
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
