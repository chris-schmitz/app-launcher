<template>
    <div class="notifications-container" :class="notificationType">
        {{ notificationMessage }}
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
            notificationType(){
                return this.sharedState.notification.type
            },
            notificationMessage:{
                get(){
                    return this.sharedState.notification.message
                },
                set(message){
                    this.sharedState.notification.message = message
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
    .success {
        background-color: $highlightSuccess;
    }
    .danger {
        background-color: $highlightDanger;
    }
    .warning {
        background-color: $highlightWarning;
    }
    .info {
        background-color: $highlightInfo;
    }
</style>
