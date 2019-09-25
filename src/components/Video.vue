<template>
    <div class="video-container" ref="container">
        <div class="video">
            <div class="video-loading" v-if="loading">
                <i class="fa fa-spinner" aria-hidden="true"></i>
            </div>
            <video id="video" ref="video"></video>
        </div>
        <LiveControls 
            :controls="initConfig.controls" 
            :pause="pause"
            :fullscreen="fullscreen"
            :visible="controlVisible"
            @changeChannel="handleChangeChannel"
            @changeClarity="handleChangeClarity"
            @togglePlay="handleTogglePlay"></LiveControls>
        <div class="video-pause" v-if="!loading && pause" @click="togglePlay">
            <div class="video-pause-wrapper"></div>
            <div><i class="fa fa-pause" aria-hidden="true"></i></div>
        </div>
    </div>
</template>
<script>
import flvjs from 'flv.js'
import LiveControls from './controls/LiveControls'
import { isFullScreen, exitFullscreen, launchFullscreen } from './utils/utils';
import config from './config';
export default {
    components: { LiveControls },
    props: {
        url: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'flv',
        },
        config: {
            type: Object,
            default () {
                return {}
            },
        },
    },
    data () {
        return {
            player: null,
            pause: false,
            loading: false,
            fullscreen: false,
            controlVisible: false,
        }
    },
    created () {
        // 初始化配置文件
        this.initConfig = Object.assign({}, config, this.config || {});
    },
    watch: {
        url: {
            handler (newVal) {
                if (newVal) {
                    this.initPlayer()
                }
            },
        },
    },
    mounted () {
        this.addEventListener()
    },
    methods: {
        initPlayer () {
            // 是否支持视频播放
            if (flvjs.isSupported()) {
                // 初始化清空已存在播放内容
                if (this.player) {
                    this.player.destroy();
                    this.player = null;
                }
                let el = this.$refs.video;
                this.player = flvjs.createPlayer({
                    type: this.type,
                    url: this.url,
                })
                this.player.attachMediaElement(el);
                this.player.load();
                // 开始播放
                this.player.play().then(() => {
                    this.pause = false;
                }).catch(() => {
                    el.pause();
                    this.pause = true;
                })
            } else {
                this.pause = true;
            }
        },
        handleTogglePlay () {
            if (this.pause) {
                this.player.play()
            } else {
                this.player.pause()
            }
            this.pause = !this.pause
        },
        addPlayerListener () { // player对象事件

        },
        addEventListener () { // video元素上事件
            let videoEl = this.$refs.video;
            let containerEl = this.$refs.container;
            let tick = null
            videoEl.addEventListener('click', () => {
                this.togglePlay()
            })
            videoEl.addEventListener('canplay', () => {
                this.loading = false
            })
            videoEl.addEventListener('waiting', () => {
                this.loading = true
            })
            containerEl.addEventListener('mousemove', () => {
                this.controlVisible = true
                clearTimeout(tick)
                tick = setTimeout(() => {
                    this.controlVisible = false
                }, 5000);
            })
            window.addEventListener('offline', () => {
                this.loading = true
                if (this.player) {
                    this.player.unload()
                }
            })
            window.addEventListener('online', () => {
                this.initPlayer()
            })
        },
        handleChangeChannel (val) {
            this.loading = true
            this.$emit('changeChannel', val)
        },
        handleChangeClarity (val) {
            this.loading = true
            this.$emit('changeClarity', val)
        },
        handleFullScreenChange() {
            if (isFullScreen()) {
                exitFullscreen();
                this.fullscreen = false;
            } else {
                launchFullscreen(this.$refs.container);
                this.fullscreen = true;
            }
        }
    }
}
</script>
<style>
@import url('../assets/video.css');
</style>