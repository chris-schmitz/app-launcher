<template>
    <div class="app-list-container">
        <ul>
            <li v-for="app in selectedGroup.launchApps">
                <span>{{ app }}</span><button @click="removeApp(app)" class="delete-app">x</button>
            </li>
        </ul>
    </div>
</template>

<script>
    import store from './Store'

    module.exports = {
        data(){
            return {
                sharedState: store.state
            }
        },
        computed:{
            selectedGroup(){
                return store.selectedGroup()
            }
        },
        methods:{
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

    .app-list-container{
        border-right: 1px solid $backgroundDark;
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
</style>
