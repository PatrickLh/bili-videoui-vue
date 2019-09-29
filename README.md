<!-- # test

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/). -->

# bili-videoui-vue
项目源于目前Chrome宣称将于2020年底放弃对flash的支持，公司目前使用的第三方直播技术中，为了实现低延迟，前端页面使用的是flv的视频流，而默认使用video播放flv视频流需要安装flash插件，而最近频繁被Chrome警告限制，所以需要找训处理flv视频流的方案

感谢BiliBili提供的[flv.js](https://github.com/bilibili/flv.js)，提供了一套播放flv视频的解决方案

于是乎，基于flv.js提供一套video的播放组件，提供以下功能：
> 1. 支持播放直播流的播放：flv, rtmp, hls
> 2. 支持视频格式文件的播放
> 3. 基础的视频播放器操作：暂停，开始，全屏播放，音量调节，清晰度调节，倍速调节

未来计划扩展功能包括但不限于：
> 1. 视频弹幕支持
> 2. 视频进度条关键帧图片显示


参数配置：
npm安装模块以后，直接引入组件
> import Video from 'bili-videoui-vue'

组件支持参数如下：
url: 视频的播放地址（可以是直播流或者非直播流）
type: 视频格式
config: 视频播放参数配置
isLive: 是否是直播模式

直播模式下可以配置以下参数：
beginTime: 直播模式下视频直播开始时间，用于直播室持续时间的显示