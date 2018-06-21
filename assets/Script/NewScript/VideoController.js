cc.Class({
    extends: cc.Component,

    properties: {
        videoPlayer: {
            default: null,
            type: cc.VideoPlayer
        },
        useSSL: {
            default: false
        },
        host: {
            default: ''
        },
        folder: '',
        fileName: {
            default: ''
        },
        loop: {
            default: false
        },
        logger: cc.Label
    },

    start() {
        this.nextSignal = false;

        this.protocol = 'http://';
        this.videoIndex = 1;

        if (D.RunFromStart) {
            // console.log('run from start!');

            this.useSSL = D.UseSSL;
            this.host = D.Host;
            this.folder = D.VideoFolder;
            this.fileName = D.VideoFile;
        }

        let url = '';
        // this.protocol  = this.useSSL ? 'https://' : 'http://';

        if (this.host.charAt(this.host.length - 1) != '/') {
            this.host += '/';
        }
        if (this.folder.charAt(this.folder.length - 1) != '/') {
            this.folder += '/';
        }
        // url = this.protocol + this.host + this.folder + this.fileName + '?v=' + cc.rand();
        let tempFileName = 'video' + this.videoIndex + '.mp4';
        url = this.protocol + this.host + this.folder + tempFileName;

        this.videoPlayer.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
        this.videoPlayer.remoteURL = url;
    },

    update() {
        if (this.nextSignal) {
            this.videoPlayer.play();
            if (this.videoPlayer.isPlaying()) {
                this.nextSignal = false;
                this.logger.node.active = false;
            }
        }
    },

    playerEventHandler(videoPlayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED: {
                // console.log('视频信息加载完成');

                if (this.logger.node.active) {
                    this.logger.string += '\n视频信息加载完成';
                }
            } break;
            case cc.VideoPlayer.EventType.READY_TO_PLAY: {
                // console.log('播放准备完成');

                if (this.logger.node.active) {
                    this.logger.string += '\n播放准备完成';
                }

                videoPlayer.play();
            } break;
            case cc.VideoPlayer.EventType.PLAYING: {
                // console.log('播放中');

                this.logger.node.active = false;
            } break;
            case cc.VideoPlayer.EventType.COMPLETED: {
                // console.log('播放完成');

                this.logger.string = '加载视频中';
                this.logger.node.active = true;

                let videoCount = D.VideoCount;
                if (videoCount > 1) {

                    this.videoIndex++;
                    if (this.videoIndex > videoCount) {
                        this.videoIndex = 1;
                    }

                    let tempFileName = 'video' + this.videoIndex + '.mp4';
                    let url = this.protocol + this.host + this.folder + tempFileName;

                    videoPlayer.remoteURL = url;
                    this.nextSignal = true;
                } else {
                    if (this.loop) {
                        videoPlayer.play();
                    }
                }

            } break;
            default: break;
        }
    }
});
