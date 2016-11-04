<template>
    <div class="group-details-container">
        <div>
            {{ selectedGroup }}
            <button v-on:click="doneEditing">Back</button>
        </div>
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
            }
        }
    }
</script>

<style lang="sass" scoped>
</style>
