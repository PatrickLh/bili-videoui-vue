<template>
  <div class="video-container">
    <div :class="{'fullscreen': document.fullscreen,'video-container-content': true}">
      <video id="video-live"></video>
    </div>
    <div class="video-controller" v-if="controls && showControls">
      <div class="video-controller-wrapper">
        <div class="video-controller-left">
          <div class="video-controller-item pause-btn" @click="playOrPause">
            <template v-if="!pause">
              <img class="ico" src="@/assets/svg/pause.svg"/>
              <img class="ico active" src="@/assets/svg/pause_active.svg"/>
            </template>
            <template v-else>
              <img class="ico" src="@/assets/svg/play.svg"/>
              <img class="ico active" src="@/assets/svg/play_active.svg"/>
            </template>
          </div>
          <div class="video-controller-item video-duration">{{duration}}</div>
          <div class="splice-line"></div>
          <div class="video-controller-item">{{onlineMemberNum || 0}}人在线 LIVE</div>
        </div>
        <div class="video-controller-right">
          <div class="video-controller-item channel-change">
            <p>{{currentChannel}}</p>
            <ul>
              <li v-for="item in CHENNELS" :key="item.value" @click="changeChannel(item)">{{item.label}}</li>
            </ul>
          </div>
          <div class="video-controller-item clarity-change">
            <p>{{currentClarity}}</p>
            <ul>
              <li v-for="item in CLARITIES" :key="item.value" @click="changeClarity(item)">{{item.label}}</li>
            </ul>
          </div>
          <div class="video-controller-item fullscreen-change" @click="changeFullScreen">
            <img class="ico" src="@/assets/svg/fullscreen.svg" v-if="!document.fullscreen"/>
            <img class="ico" src="@/assets/svg/fullscreen_exit.svg" v-if="document.fullscreen"/>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-message-tips" v-if="msgTip">
      <div class="tips-message">{{msgTip}}</div>
      <div class="tips-close ibang-close" @click="clearMsgTip"></div>
    </div>
    <div class="video-loading" v-if="loading">
      <img class="icon" src="@/assets/svg/loading.svg"/>
      <div>视频加载中</div>
    </div>
    <div class="video-pause" v-if="!loading && pause" @click="playOrPause">
      <div class="video-pause-wrapper"></div>
      <div><img class="icon" src="@/assets/svg/pause.svg"></div>
    </div>
  </div>
</template>
<script>
import flvjs from 'flv.js'
const CHENNELS = [{ label: '线路1', value: '1' },
  { label: '线路2', value: '2' }]
const CLARITIES = [{ label: '超清', value: '_1280' },
  { label: '高清', value: '_640' },
  { label: '标清', value: '_360' }]

export default {
  data () {
    return {
      player: null,
      pause: true,
      CHENNELS,
      CLARITIES,
      currentChannel: CHENNELS[0].label,
      currentClarity: CLARITIES[0].label,
      loading: true,
      showControls: true,
      document: window.document,
    }
  },
  props: {
    config: {
      type: Object,
      default () {
        return {}
      },
    },
    videoAddress: {
      type: Object,
      default () {
        return {}
      },
    },
    onlineMemberNum: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: '',
    },
    controls: {
      type: Boolean,
      default: false,
    },
    msgTip: {
      type: String,
      default: '',
    },
  },
  watch: {
    videoAddress: {
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
  destroyed () {
    if (this.player) {
      this.player.unload()
    }
  },
  methods: {
    initPlayer () {
      if (flvjs.isSupported()) {
        if (this.player) {
          this.player.destroy()
          this.player = null
        }
        let videoElement = document.getElementById('video-live')
        this.player = flvjs.createPlayer({
          type: 'flv',
          url: this.videoAddress.httpPullUrl,
        })
        this.player.attachMediaElement(videoElement)
        this.player.load()
        this.player.play().then(res => {
          this.pause = false
        }).catch(err => {
          console.log('err', err)
          videoElement.pause()
          this.pause = true
        })
      }
    },
    playOrPause () {
      if (this.pause) {
        this.player.play()
      } else {
        this.player.pause()
      }
      this.pause = !this.pause
    },
    addEventListener () {
      let el = document.getElementById('video-live')
      let tick = null
      // 时间氛围两种，一个是player上的事件，另一个是video元素上的事件，虽然实际上是一样的
      el.addEventListener('click', () => {
        this.playOrPause()
      })
      el.addEventListener('canplay', () => {
        this.loading = false
      })
      el.addEventListener('waiting', () => {
        this.loading = true
      })
      el.addEventListener('mousemove', () => {
        this.showControls = true
        clearTimeout(tick)
        tick = setTimeout(() => {
          this.showControls = false
        }, 10000)
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
    changeChannel (item) {
      if (this.currentChannel !== item.label) {
        this.currentChannel = item.label
        this.currentClarity = CLARITIES[0].label
        this.$emit('changeChannel', item.value)
        this.loading = true
      }
    },
    changeClarity (item) {
      if (this.currentClarity !== item.label) {
        this.currentClarity = item.label
        this.$emit('changeClarity', item.value)
        this.loading = true
      }
    },
    changeFullScreen () {
      if (document.fullscreen || document.isFullScreen) {
        this.exitFullscreen()
      } else {
        this.launchFullscreen(document.querySelector('.video-container'))
      }
    },
    launchFullscreen (element) {
      // 此方法不可以在異步任務中執行，否則火狐無法全屏
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.oRequestFullscreen) {
        element.oRequestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen()
      }
    },
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.oRequestFullscreen) {
        document.oCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    clearMsgTip () {
      this.$emit('clearMsgTip')
    },
  },
}
</script>
<style lang="scss" scoped>
@keyframes loadingrun {
  0% { transform: rotateZ(0) }
  0% { transform: rotateZ(360deg) }
}
.video-container {
  position: relative;
  background: #000;
  height: 100%;
  width: 100%;
  &:hover {
    .video-controller {
      opacity: 1;
    }
  }
  .video-container-content {
    width: 840px;
    height: 100%;
    margin: auto;
    &.fullscreen {
      width: 100%;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
  .custom-message-tips{
    position: absolute;
    left: 20px;
    bottom: 60px;
    background: #111;
    height: 24px;
    z-index: 10;
    border-radius: 4px;
    font-size: 14px;
    padding: 2px 0;
    display: flex;
    align-items: center;
    .tips-message{
      color: #fff;
      margin-left: 10px;
    }
    .tips-close{
      color: #fff;
      width: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .video-loading{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    font-size: 14px;
    color: #bfbfbf;
    .icon {
      width: 36px;
      animation: loadingrun 1s infinite linear;
    }
  }
  .video-pause {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    .video-pause-wrapper {
      position: absolute;
      height: 100%;
      width: 100%;
      opacity: 0.2;
      background: #000;
    }
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 36px;
    }
  }
}
.video-controller {
  position: absolute;
  width: 100%;
  height: 80px;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.7));
  color: white;
  transition: opacity .5s;
  opacity: 0;
  .video-controller-wrapper {
    display: flex;
    margin-top: 50px;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    font-size: 14px;
    .video-controller-left {
      display: flex;
      align-items: center;
    }
    .video-controller-right {
      display: flex;
      align-items: center;
    }
    .video-controller-item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 10px;
      &.pause-btn {
        cursor: pointer;
        .ico {
          width: 16px;
          height: 16px;
          &.active {
            display: none;
          }
        }
        &:hover {
          .ico {
            display: none;
            &.active {
              display: block;
            }
          }
        }
      }
      &.channel-change {
        position: relative;
        cursor: pointer;
        &:hover {
          ul {
            display: block;
          }
        }
      }
      &.clarity-change {
        position: relative;
        cursor: pointer;
        &:hover {
          ul {
            display: block;
          }
        }
      }
      &.fullscreen-change {
        cursor: pointer;
        &:hover {
          color: #ed6c00;
        }
        .ico {
          width: 16px;
          height: 16px;
        }
      }
      ul {
        display: none;
        position: absolute;
        bottom: 30px;
        background: #222;
        width: 60px;
        border-radius: 6px;
        text-align: center;
        li {
          padding: 5px;
          transition: all .3s;
          &:hover {
            color: #ed6c00;
          }
        }
        &:after {
          content: '';
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border: 8px solid;
          left: 22px;
          border-color: #222 transparent transparent transparent;
        }
      }
    }
    .splice-line {
      height: 15px;
      width: 1px;
      margin: 0 6px;
      background: #fff;
    }
  }
}
</style>
