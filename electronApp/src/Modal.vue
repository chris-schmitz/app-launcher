<template>
    <div class="modal-container">
        <div class="modal-window">
            <p>
                <slot name="message"></slot>
            </p>
            <slot name="buttons"></slot>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data(){
            return {
                name: 'modal'
            }
        },
        methods:{

        }
    }
</script>

<style lang="sass" scoped>
    @import "style/_variables.sass";
    @import "style/_mixins.sass";

    $buttonWidth: 100px;

    .modal-container{
        z-index: 9999999;
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right: 0;
        background-color: rgba(0,0,0, .5);

        display: flex;
        justify-content: center;
        align-items: center;

        .modal-window{
            background-color: $background;
            padding:0 20px 0 20px;
            height: 150px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: stretch;
        }

        .button-container{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .confirm{
                @include regular-button($highlightSuccess, $white);
                width: $buttonWidth;
            }
            .cancel{
                @include regular-button($highlightDanger, $white);
                width: $buttonWidth;
            }
        }
    }
</style>
