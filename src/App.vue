<template>
  <div id="app">
    <Video url="http://flv4275c5f7.live.126.net/live/ea168070cbf84ee2831a4dabd7a1b011_S2.flv?netease=flv4275c5f7.live.126.net"
    :beginTime="beginTime"
    :config="config"/>
    <button @click="handleClick">addBeginTime</button>
    {{beginTime}}
  </div>
</template>

<script>
import Video from './components/Video.vue'

export default {
  name: 'app',
  components: {
    Video
  },
  data () {
    return {
      beginTime: 0,
      config: {
        isShowControls: true,
        isShowClarities: false,
      }
    }
  },
  methods: {
    handleClick() {
      this.beginTime = this.beginTime ? this.beginTime + 1000 :  Date.now();
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>
