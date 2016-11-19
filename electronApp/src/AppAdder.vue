<template>
    <div class="app-adder-container">
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
</template>

<script>
    import store from './Store'

    module.exports = {
        data(){
            return {
                sharedState: store.state,
                overDropTarget: false
            }
        },
        computed:{
            dropTargetActive:{
                get(){
                    return this.sharedState.dropTargetActive
                },
                set(active){
                    this.sharedState.dropTargetActive = active
                }
            },
            selectedGroup(){
                return store.selectedGroup()
            }
        },
        methods:{
            setOverDropTarget(state){
                this.overDropTarget = state
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
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "style/_variables.sass";
    @import "style/_mixins.sass";

    .app-adder-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {margin-top:10px; margin-bottom:10px;}

        .file-selector-input-label {
            margin-left: 10px;
            margin-right: 10px;
            text-align: center;
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
</style>
