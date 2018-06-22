// var VideoSpawner = require('VideoSpawner');

cc.Class({
    extends: cc.Component,

    properties: {
        // videoSpawner: VideoSpawner
    },


    start() {

    },

    playerEventHandler(videoPlayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED: {
                console.log('视频信息加载完成');

            } break;
            case cc.VideoPlayer.EventType.READY_TO_PLAY: {
                console.log('播放准备完成');

                videoPlayer.play();
            } break;
            case cc.VideoPlayer.EventType.PLAYING: {
                console.log('播放中');
            } break;
            case cc.VideoPlayer.EventType.COMPLETED: {
                console.log('播放完成');

                this.videoSpawner.nextVideo();

            } break;
            default: break;
        }
    },


    onDestroy() {
        console.log('Destroy me!');

    }
});
