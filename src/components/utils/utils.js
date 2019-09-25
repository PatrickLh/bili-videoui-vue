// 获取播放地址后缀但播放类型
function suffix (url) {
    return url.substring(url.lastIndexOf('.') + 1);
}

function launchFullscreen (element) {
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
}
function exitFullscreen () {
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
}
function isFullScreen () {
    return document.fullscreen || document.isFullScreen
}
export {
    suffix,
    launchFullscreen,
    exitFullscreen,
    isFullScreen
}