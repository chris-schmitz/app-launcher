<template>
    <div class="app-list-container">
        <h4 class="heading">This group launches the apps:</h4>
        <ul>
            <li v-for="app in selectedGroup.launchApps">
                <span>{{ app }}</span><button @click="removeApp(app)" class="delete-app">x</button>
            </li>
        </ul>
    </div>
</template>

<script>
    let store = require('./Store')

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
        overflow: hidden;
        border-right: 1px solid $backgroundDark;
        display:flex;
        flex-direction: column;
        justify-content: flex-start;

        .delete-app{
            @include regular-button($highlightDanger, $white)
        }

        .heading{}

        ul {
            margin: 0;
            margin-right: 10px;
            padding-left: 0;
            list-style: none;
            overflow:scroll;

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
