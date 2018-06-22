cc.Class({
    extends: cc.Component,

    properties: {
        videoPlayerPrefab: cc.Prefab,
        spawnerNode: cc.Node,
        host: {
            default: ''
        },
        folder: '',
        fileName: '',
        loop: false,
        logger: cc.Label
    },

    start() {
        this.protocol = 'http://';

        this.videoCount = D.VideoCount;
        this.videoIndex = 1;
        this.currentVideoPlayer = null;
        this.nextVideo();
    },

    nextVideo() {

        if (this.videoCount <= 1) {
            if (this.currentVideoPlayer) {
                let videoPlayer = (this.currentVideoPlayer).getComponent(cc.VideoPlayer);
                videoPlayer.play();
                console.log('no first!');

                return;
            }
            else {
                console.log('first!');

            }
        }

        if (this.currentVideoPlayer) {
            this.currentVideoPlayer.destroy();
            this.currentVideoPlayer = null;
        }

        if (this.host.charAt(this.host.length - 1) != '/') {
            this.host += '/';
        }
        if (this.folder.charAt(this.folder.length - 1) != '/') {
            this.folder += '/';
        }
        let url = this.protocol + this.host + this.folder + this.fileName;

        this.creatVideoPlayer(url);
    },

    creatVideoPlayer(url) {
        let viderPlayerObjcet = cc.instantiate(this.videoPlayerPrefab);
        this.spawnerNode.addChild(viderPlayerObjcet);

        let videoPlayer = viderPlayerObjcet.getComponent(cc.VideoPlayer);
        let videoHandler = viderPlayerObjcet.getComponent('VideoHandler');

        videoHandler.videoSpawner = this;

        videoPlayer.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
        videoPlayer.remoteURL = url;

        this.currentVideoPlayer = viderPlayerObjcet;
    }

});
