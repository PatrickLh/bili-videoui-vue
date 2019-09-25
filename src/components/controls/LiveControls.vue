<template>
    <div class="video-control-wrap">
        <div class="video-control-mask"></div>
        <transition name="fade">
            <div class="video-control" v-if="controls.show && visible">
                <div class="video-control-left">
                    <div class="video-control-item" @click="handleTogglePlay">
                        <i :class="['fa', {'fa-pause': !pause, 'fa-play': pause}]" aria-hidden="true" @click="handleTogglePlay"></i>
                    </div>
                    <div class="video-control-item video-duration">10:00:00</div>
                    <div class="video-control-item" v-show="onlineMemberNum">{{onlineMemberNum || 0}}人在线</div>
                </div>
                <div class="video-control-center"></div>
                <div class="video-control-right">
                    <!-- 频道切换 -->
                    <div class="video-control-item channel-change" v-if="controls.CHANNELS">
                        <Popover>
                            <span slot="label">{{channel}}</span>
                            <ul slot="content">
                                <li v-for="item in controls.CHANNELS" :key="item.value" @click="changeChannel(item)">{{item.label}}</li>
                            </ul>
                        </Popover>
                    </div>
                    <!-- 清晰度切换 -->
                    <div class="video-control-item clarity-change" v-if="controls.CLARITIES">
                        <Popover>
                            <span slot="label">{{clarity}}</span>
                            <ul slot="content">
                                <li v-for="item in controls.CLARITIES" :key="item.value" @click="changeClarity(item)">{{item.label}}</li>
                            </ul>
                        </Popover>
                    </div>
                    <!-- 全屏切换 -->
                    <div class="video-control-item fullscreen-change" @click="changeFullScreen">
                        <i class="fa fa-expand" aria-hidden="true" v-if="!fullscreen"></i>
                        <i class="fa fa-compress" aria-hidden="true" v-if="fullscreen"></i>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Popover from './Popover'
export default {
    components: { Popover },
    props: {
        controls: {
            type: Object,
            default () {
                return {}
            }
        },
        pause: {
            type: Boolean,
            default: false,
        },
        fullscreen: {
            type: Boolean,
            default: false,
        },
        visible: {
            type: Boolean,
            default: false,
        }
    },
    data () {
        return {
            channel: this.controls.CHANNELS[0].label,
            clarity: this.controls.CLARITIES[0].label,
            onlineNum: 0,
            duration: 0,
            onlineMemberNum: 0,
        }
    },
    methods: {
        changeChannel (item) {
            if (this.channel !== item.label) {
                this.channel = item.label
                this.clarity = this.controls.CLARITIES[0].label
                this.$emit('changeChannel', item.value)
            }
        },
        changeClarity (item) {
            if (this.clarity !== item.label) {
                this.clarity = item.label
                this.$emit('changeClarity', item.value)
            }
        },
        changeFullScreen () {
            this.$emit('changeFullScreen')
        },
        handleTogglePlay () {
            this.$emit('togglePlay')
        }
    }
}
</script>
<style lang="">
    
</style>