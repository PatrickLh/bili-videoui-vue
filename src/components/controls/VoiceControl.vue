<template>
    <div class="volume" @mouseover="doHover(true)" @mouseleave="doHover(false)">
        <transition name="fade">
            <div class="volume-container" v-show="hover" >
                <div class="volume-num">{{currentVolume}}</div>
                <div class="volume-bar-wrapper" ref="bar" @click="handleBarClick">
                    <div class="volume-bar">
                        <div class="volume-bar-active" ref="barActive"></div>
                        <div class="volume-pointer-wrapper"
                            ref="pointer"
                            @mousedown="handlePointerActive"
                            @touchstart="handlePointerActive">
                            <div class="volume-pointer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <i class="fa fa-volume-down"></i>
    </div>
</template>
<script>
import { between } from '../utils';
export default {
    props: {
        volume: {
            type: Number,
            default: 100,
        }
    },
    data () {
        return {
            dragging: false,
            hover: false,
            tick: null,
        }
    },
    computed:{
        currentVolume () {
            return Math.round(this.volume * 100);
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
        },
        handleBarClick (event) {
            this.setPosition(event);
        },
        handlePointerActive (event) {
            event.preventDefault();
            this.onDragStart(event);
            window.addEventListener('mousemove', this.onDragging)
            window.addEventListener('touchmove', this.onDragging)
            window.addEventListener('mouseup', this.onDragEnd)
            window.addEventListener('touchend', this.onDragEnd)
            window.addEventListener('contextmenu', this.onDragEnd)
        },
        onDragStart (event) {
            // 记录当前位置
            this.dragging = true
            this.start = event.clientY;
        },
        onDragging (event) {
            if (this.dragging) {
                this.setPosition(event)
            }
        },
        onDragEnd () {
            if (this.dragging) {
                this.dragging = false
                window.removeEventListener('mousemove', this.onDragging)
                window.removeEventListener('touchmove', this.onDragging)
                window.removeEventListener('mouseup', this.onDragEnd)
                window.removeEventListener('touchend', this.onDragEnd)
                window.removeEventListener('contextmenu', this.onDragEnd)
            }
        },
        setPosition (event) {
            // 分别获取滑块和bar的位置
            let {y: barY, height: barHeight} = this.$refs.bar.getBoundingClientRect();
            // pointer相对于bar的位置
            let percent = between(100 - Math.floor((event.clientY - barY) / barHeight * 100), 0, 100);
            this.$refs.pointer.style.bottom = `${percent}%`;
            this.$refs.barActive.style.height = `${percent}%`;
            this.$emit('changeVolume', percent / 100)
        }
    }
}
</script>
<style>
.volume {
    position: relative;
    margin: 0 12px;
}
.volume .volume-container {
    position: absolute;
    bottom: 30px;
    width: 30px;
    left: 50%;
    background: #222;
    text-align: center;
    padding: 6px 0;
    transform: translateX(-50%);
    border-radius: 4px;
}
.volume-container .volume-bar-wrapper {
    height: 60px;
    width: 100%;
    margin: 8px 0 6px 0;
    cursor: pointer;
}
.volume-container .volume-bar-wrapper .volume-bar {
    position: relative;
    height: 100%;
    width: 2px;
    background: #ddd;
    margin: auto;
}
.volume-container .volume-bar-active {
    position: absolute;
    bottom: 0%;
    height: 100%;
    width: 2px;
    background: #ed6c00;
    margin: auto;
}
.volume-container .volume-pointer-wrapper {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 24px;
    height: 24px;
    text-align: center;
    transform: translate(-50%, 50%);
}
.volume-container .volume-pointer {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ed6c00;
}
.volume i {
    font-size: 20px;
}
</style>