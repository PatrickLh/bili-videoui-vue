<template>
    <div class="popover" @mouseover="doHover(true)" @mouseleave="doHover(false)">
        <transition name="fade">
            <div class="content" v-show="hover" @click="doHover(false)">
                <slot name="content"></slot>
            </div>
        </transition>
        <div class="label">
            <slot name="label"></slot>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            hover: false,
            tick: null
        }
    },
    methods: {
        doHover (bool) {
            if (this.tick) {
                clearTimeout(this.tick)
            }
            if (bool) {
                this.hover = bool;
            } else {
                this.tick = setTimeout(() => {
                    this.hover = bool;
                }, 100);
            }
        }
    }
}
</script>
<style>
    .popover {
        position: relative;
    }
    .popover .content{
        position: absolute;
        left: 50%;
        bottom: 0;
        margin-bottom: 30px;
        transform: translateX(-50%);
        text-align: center;
        background: #222;
        padding: 8px;
        border-radius: 4px;
        min-width: 100px;
    }
    .popover .label{
        cursor: pointer;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>