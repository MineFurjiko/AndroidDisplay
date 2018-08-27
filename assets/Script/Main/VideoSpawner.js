cc.Class({
    extends: cc.Component,

    properties: {
        videoPlayerPrefab: cc.Prefab,
        spawnerNode: cc.Node,
        remote: false,
        host: {
            default: ''
        },
        folder: '',
        fileName: '',
        videoCount: 1,
        localVideo: [cc.RawAsset],
        logger: cc.Label
    },

    start() {
        if (D.RunFromStart) {
            // console.log('run from start!');
            this.useSSL = D.UseSSL;
            this.host = D.Host;
            this.folder = D.VideoFolder;
            this.fileName = D.VideoFile;
            this.videoCount = D.VideoCount;
        }

        this.protocol = 'http://';

        this.videoIndex = 1;
        this.currentVideoPlayer = null;

        this.nextVideo();
    },

    nextVideo() {

        if (this.videoCount == 1) {
            if (this.currentVideoPlayer) {
                let videoPlayer = (this.currentVideoPlayer).getComponent(cc.VideoPlayer);
                videoPlayer.play();
                return;
            }
        }

        if (this.currentVideoPlayer) {
            this.currentVideoPlayer.destroy();
            // console.log('销毁旧视频');

            this.currentVideoPlayer = null;
        }

        if (this.remote) {
            let url = this.getAssetUrl();
            this.creatVideoPlayerByUrl(url);
            this.resetLogger();
            return;
        }

        let clip = this.getAssetClip();
        if (!clip && this.videoCount == 1) {
            this.switchLoggerActive(true);
            this.addLog('请检查唯一的视频文件...');
            return;
        }
        while (clip == null) {
            clip = this.getAssetClip();
        }
        this.creatVideoPlayerByClip(clip);
        // this.resetLogger();
    },

    getAssetClip() {
        let clip = this.localVideo[this.videoIndex - 1];
        cc.log(clip);
        //check file
        if (!clip) {
            clip = null;

            this.switchLoggerActive(true);
            this.addLog('跳过' + this.videoIndex + '号错误视频...');
        }

        this.videoIndex++;
        if (this.videoIndex > this.videoCount) {
            this.videoIndex = 1;
        }

        return clip;
    },

    getAssetUrl() {
        if (this.host.charAt(this.host.length - 1) != '/') {
            this.host += '/';
        }
        if (this.folder.charAt(this.folder.length - 1) != '/') {
            this.folder += '/';
        }

        let url = this.protocol + this.host + this.folder;
        url += 'video' + this.videoIndex + '.mp4';

        this.videoIndex++;
        if (this.videoIndex > this.videoCount) {
            this.videoIndex = 1;
        }

        return url;
    },

    creatVideoPlayerByUrl(url) {
        let viderPlayerObjcet = cc.instantiate(this.videoPlayerPrefab);
        this.spawnerNode.addChild(viderPlayerObjcet);

        let videoHandler = viderPlayerObjcet.getComponent('VideoHandler');
        videoHandler.videoSpawner = this;

        let videoPlayer = viderPlayerObjcet.getComponent(cc.VideoPlayer);
        videoPlayer.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
        videoPlayer.remoteURL = url;

        this.currentVideoPlayer = viderPlayerObjcet;
    },

    creatVideoPlayerByClip(clip) {
        let viderPlayerObjcet = cc.instantiate(this.videoPlayerPrefab);
        this.spawnerNode.addChild(viderPlayerObjcet);

        let videoHandler = viderPlayerObjcet.getComponent('VideoHandler');
        videoHandler.videoSpawner = this;

        let videoPlayer = viderPlayerObjcet.getComponent(cc.VideoPlayer);
        videoPlayer.resourceType = cc.VideoPlayer.ResourceType.LOCAL;
        videoPlayer.clip = clip;

        this.currentVideoPlayer = viderPlayerObjcet;
    },

    addLog(log) {
        if (this.logger.node.active) {
            this.logger.string += '\n' + log;
        }
    },

    switchLoggerActive(b) {
        this.logger.node.active = b;
    },

    resetLogger() {
        this.logger.string = '加载视频中';
        this.switchLoggerActive(true);
    }

});
