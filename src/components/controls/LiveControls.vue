<template>
    <transition name="fade">
        <div class="video-control-wrap" v-if="controls.show && visible">
            <div class="video-control-mask"></div>
            <div class="video-control">
                <div class="video-control-left">
                    <div class="video-control-item" @click="handleTogglePlay">
                        <i :class="['fa', {'fa-pause': !pause, 'fa-play': pause}]" aria-hidden="true" @click="handleTogglePlay"></i>
                    </div>
                    <div class="video-control-item video-duration">{{duration}}</div>
                    <div class="video-control-item" v-show="onlineMemberNum">{{onlineMemberNum || 0}}人在线</div>
                </div>
                <div class="video-control-center"></div>
                <div class="video-control-right">
                    <!-- 音量调节 -->
                    <VoiceControl v-if="controls.showVolume" :volume="volume" @changeVolume="handleChangeVolume"></VoiceControl>
                    <!-- 频道切换 -->
                    <div class="video-control-item channel-change" v-if="controls.CHANNELS && controls.showChannels">
                        <Popover>
                            <span slot="label">{{channel}}</span>
                            <ul slot="content">
                                <li v-for="item in controls.CHANNELS" :key="item.value" @click="changeChannel(item)">{{item.label}}</li>
                            </ul>
                        </Popover>
                    </div>
                    <!-- 清晰度切换 -->
                    <div class="video-control-item clarity-change" v-if="controls.CLARITIES && controls.showClarities">
                        <Popover>
                            <span slot="label">{{clarity}}</span>
                            <ul slot="content">
                                <li v-for="item in controls.CLARITIES" :key="item.value" @click="changeClarity(item)">{{item.label}}</li>
                            </ul>
                        </Popover>
                    </div>
                    <!-- 全屏切换 -->
                    <div class="video-control-item fullscreen-change" @click="changeFullScreen">
                        <i :class="['fa', {'fa-expand': !fullscreen, 'fa-compress': fullscreen}]"></i>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import Popover from './Popover';
import VoiceControl from './VoiceControl';
import { formatter } from '../utils'
export default {
    components: { Popover, VoiceControl },
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
        },
        beginTime: {
            type: Number,
            default: 0,
        },
        volume: {
            type: Number,
            default: 1,
        }
    },
    data () {
        return {
            channel: this.controls.CHANNELS[0].label,
            clarity: this.controls.CLARITIES[0].label,
            onlineNum: 0,
            onlineMemberNum: 0,
            duration: '',
            tick: null,
            i: 0.1,
        }
    },
    mounted() {
        this.calcDuration();
    },
    destroyed() {
        if (this.tick) {
            clearInterval(this.tick);
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
        },
        calcDuration() {
            this.tick = setInterval(() => {
                if (this.beginTime) {
                    this.duration = formatter(Date.now() - this.beginTime);
                }
            }, 1000);
        },
        handleChangeVolume (val) {
            this.$emit('changeVolume', val);
        },
    },
}
</script>
<style lang="">
    
</style>