cc.Class({
    extends: cc.Component,

    properties: {

    },

    playerEventHandler(videoPlayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED: {
                this.addLog('视频信息加载完成');

            } break;
            case cc.VideoPlayer.EventType.READY_TO_PLAY: {
                this.addLog('播放准备完成');
                videoPlayer.play();

            } break;
            case cc.VideoPlayer.EventType.PLAYING: {
                this.addLog('播放中');
                if (this.videoSpawner) {
                    this.videoSpawner.switchLoggerActive(false);
                }

            } break;
            case cc.VideoPlayer.EventType.COMPLETED: {
                this.addLog('播放完成');
                if (this.videoSpawner) {
                    this.videoSpawner.nextVideo();
                }

            } break;
            default: break;
        }
    },

    addLog(message) {
        // console.log(message);

        if (this.videoSpawner) {
            this.videoSpawner.addLog(message);
        }
    },

    onDestroy() {
        this.node.destroy();
    }
});
