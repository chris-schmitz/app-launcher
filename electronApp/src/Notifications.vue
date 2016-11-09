<template>
    <div v-if="notificationMessage" class="notifications-container">
        <slot></slot>
        <button @click="close">x</button>
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
            notificationMessage:{
                get(){
                    return this.sharedState.notificationMessage
                },
                set(message){
                    this.sharedState.notificationMessage = message
                }
            }
        },
        methods: {
            close(){
                this.notificationMessage = null
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "./style/_variables.sass";
    @import "./style/_mixins.sass";

    .notifications-container{
        background-color: $highlightInfo;
        border: 1px solid darken($highlightInfo, 20%);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        button {
            @include regular-button($highlightDanger, $white);
        }
    }
</style>
