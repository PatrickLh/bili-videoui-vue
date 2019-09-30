// 默认控制器配置
export default {
    controls: {
        // 是否显示控制栏
        show: true,
        // 是否显示频道切换
        showChannels: true,
        CHANNELS:[
            { label: '线路1', value: '1' },
            { label: '线路2', value: '2' }
        ],
        // 是否显示清晰度配置
        showClarities: true,
        CLARITIES:[
            { label: '超清', value: '_1280' },
            { label: '高清', value: '_640' },
            { label: '标清', value: '_360' }
        ],
        // 是否显示音量
        showVolume: true,
    }
}