<template>
    <div
        class="app-launcher"
        v-on:dragenter="makeDropTargetActive(true)"
        v-on:dragleave="makeDropTargetActive(false)"
    >
        <h1>App Launcher</h1>
        <!--
        Note that we need to control the display state of the notification here in the parent context not because
        it won't work if we encapsulate it in the notification component, but because if we do it blows up vue devtools
        -->
        <notifications v-if="notificationMessage"></notifications>
        <div class="content-container">
            <group-list class="group-list-wrapper" v-if="currentView === 'groupList'"></group-list>
            <group-details v-if="currentView === 'groupDetails'"></group-details>
        </div>
        <div class="actions">
            <button v-show="this.sharedState.groupContainerView === 'groupList'" class="new-group" @click="createNewGroup">New Group</button>
        </div>
        <div class="toolbar">
            <label>
                <input type="checkbox" v-model="hideAppOnLaunch"> Only show menubar on launch.
            </label>
        </div>
        <div
            v-show="dropTargetActive"
            class="lightbox-mask"
        ></div>
    </div>
</template>

<script>
    let  store = require('./Store')
    let  GroupList = require('./GroupList.vue')
    let  GroupDetails = require('./GroupDetails.vue')
    let  Notifications = require('./Notifications.vue')

    module.exports = {
        components:{GroupList, GroupDetails,Notifications},
        data(){
            return {
                sharedState: store.state,
                dragcounter: 0
            }
        },
        computed:{
            currentView(){
                return this.sharedState.groupContainerView
            },
            dropTargetActive:{
                get(){
                    return this.sharedState.dropTargetActive
                },
                set(active){
                    this.sharedState.dropTargetActive = active
                }
            },
            notificationMessage(){
                return this.sharedState.notification.message
            },
            hideAppOnLaunch:{
                get(){
                    return this.sharedState.hideAppOnLaunch
                },
                set(hide){
                    this.sharedState.hideAppOnLaunch = hide
                }
            }
        },
        methods:{
            createNewGroup(){
                let newGroup = store.newGroup('New Group')
                this.sharedState.groups.push(newGroup)
                store.selectGroup(newGroup.id)
                store.setContainerView('groupDetails')
            },
            makeDropTargetActive(state){
                // This seems really goofey and you should come back and clean
                // it up, but for now it's working and it's time to go to wrk so
                // LET'S GOOOO!
                if(state){
                    this.dragcounter++
                } else {
                    this.dragcounter--
                }

                if(this.dragcounter !== 0){
                    this.dropTargetActive = true
                } else {
                    this.dropTargetActive = false
                }
            }
        },
        watch:{
            hideAppOnLaunch(hide){
                store.toggleHideAppOnLaunch(hide)
            }
        },
        mounted(){
            document.ondragover = document.ondrop = (ev) => {
              ev.preventDefault()
            }
            store.getHideAppOnLaunchState()
            store.loadGroups()
        }
    }
</script>

<style lang="sass" scoped>
    @import "./style/_variables.sass";
    @import "./style/_mixins.sass";

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
            background-color: $background;
        }

        .group-list-wrapper{
            overflow-y: auto;
        }

        .actions{
            display:flex;
            justify-content: center;
            margin-top: 10px;

            .new-group{
                @include regular-button($highlightSuccess, $white);
            }
        }

        .lightbox-mask{
            position: fixed;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(black, .6);
            z-index:100;
        }

        .toolbar{
            margin:5px;
            // background-color: $background;
            padding:5px;
            display: flex;

            label{
                font-size:10pt;
            }
        }

    }
</style>
