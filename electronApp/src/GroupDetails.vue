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
                    <ul>
                        <li v-for="app in selectedGroup.launchApps">
                            <span>{{ app }}</span><button @click="removeApp(app)" class="delete-app">x</button>
                        </li>
                    </ul>
            </div>
            <div class="add-app">
                <div
                    class="drag-and-drop-target"
                    v-on:dragenter="setOverDropTarget(true)"
                    v-on:dragleave="setOverDropTarget(false)"
                    v-on:drop="getPathForDroppedFile"
                    :class="{'dropTargetActive': dropTargetActive}"
                >
                    <span v-if="!overDropTarget">Drop app to add</span>
                    <span v-if="overDropTarget">Bombs away!</span>

                </div>
                <span>or</span>
                <label class="file-selector-input-label">
                    Select to Add
                    <input v-on:change="getPathForSelectedFiles" type="file" name="files[]"  multiple/>
                </label>
            </div>
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
    import Store from './Store'

    module.exports = {
        data(){
            return {
                sharedState: Store.state,
                overDropTarget: false,
            }
        },
        computed:{
            containerViewMode(){
                return this.sharedState.getContainerViewMode()
            },
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
            },
            dropTargetActive:{
                get(){
                    return this.sharedState.dropTargetActive
                },
                set(active){
                    this.sharedState.dropTargetActive = active
                }
            }
        },
        methods:{
            doneEditing(){
                this.sharedState.setContainerView('groupList')
            },
            makeDropTargetActive(state){
                this.dropTargetActive = state
            },
            setOverDropTarget(state){
                this.overDropTarget = state
            },
            deleteGroup(){
                this.sharedState.deleteGroup(this.selectedGroup)
                this.backToGroupList()
            },
            saveGroup(){
                this.sharedState.saveGroup(this.selectedGroup)
                this.backToGroupList()
            },
            backToGroupList(){
                this.sharedState.setContainerView('groupList')
            },
            getPathForSelectedFiles(event){
                Object
                    .keys(event.target.files)
                    .forEach(key => {
                        this.addFileToGroupLaunchApps(event.target.files[key].path)
                    })
            },
            getPathForDroppedFile(event){
                let appPath = event.dataTransfer.files[0].path;
                this.addFileToGroupLaunchApps(appPath)
                this.setOverDropTarget(false)
                this.dropTargetActive = false
            },
            addFileToGroupLaunchApps(path){
                this.selectedGroup.launchApps.push(path)
            },
            removeApp(app){
                let index = this.selectedGroup.launchApps.indexOf(app)
                if(index !== -1){
                    this.selectedGroup.launchApps.splice(index, 1)
                }
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
                border-right: 1px solid $backgroundDark;
                flex: 4;
                display:flex;
                flex-direction: column;
                justify-content: flex-start;
                overflow-y: scroll;

                .delete-app{
                    @include regular-button($highlightDanger, $white)
                }

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

                .file-selector-input-label {
                    margin-left: 10px;
                    margin-right: 10px;
                    @include regular-button($highlightInfo, $white);

                    input{
                        width: 0.1px;
                    	height: 0.1px;
                    	opacity: 0;
                    	overflow: hidden;
                    	position: absolute;
                    	z-index: -1;
                    }
                }

                .drag-and-drop-target{
                    border: 2px dashed $highlightInfo;
                    height: 100px;
                    width: 100px;
                    background-color: $white;
                    color:$backgroundDark;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    z-index:101;
                }
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
