cc.Class({
    extends: cc.Component,

    properties: {
        ipSSLToggle: {
            default: null,
            type: cc.Toggle,
            displayName: 'IP SSL Toggle'
        },
        ipInput: {
            default: null,
            type: cc.EditBox,
            displayName: 'IP Input'
        },
        imageFolderInput: cc.EditBox,
        imageFileInput: cc.EditBox,
        imageIntervalInput: cc.EditBox,
        videoFolderInput: cc.EditBox,
        videoFileInput: cc.EditBox,
        videoCountInput: cc.EditBox
    },

    start() {
        let host = cc.sys.localStorage.getItem('host');
        let useSSL = cc.sys.localStorage.getItem('useSSL');
        let videoCount = cc.sys.localStorage.getItem('videoCount');
        // console.log(host);
        // console.log(useSSL);
        // console.log(videoCount);

        if (host == '' || host == null) {
            this.ipInput.string = D.Host;
        } else {
            this.ipInput.string = host;
        }

        if (useSSL == '' || useSSL == null) {
            this.ipSSLToggle.isChecked = D.UseSSL;
        } else {
            this.ipSSLToggle.isChecked = (useSSL == 'true' ? true : false);
        }

        if (videoCount == '' || videoCount == null) {
            this.videoCountInput.string = D.VideoCount;
        } else {
            this.videoCountInput.string = Number(videoCount);
        }

        this.imageFolderInput.string = D.ImageFolder;
        this.imageFileInput.string = D.ImageFile;
        this.imageIntervalInput.string = D.ImageInterval;
        this.videoFolderInput.string = D.VideoFolder;
        this.videoFileInput.string = D.VideoFile;
    },

    getInputIP() {
        let host = this.ipInput.string;
        let useSSL = this.ipSSLToggle.isChecked;
        let imageFolder = this.imageFolderInput.string;
        let imageFile = this.imageFileInput.string;
        let imageInterval = Number(this.imageIntervalInput.string);
        let videoFolder = this.videoFolderInput.string;
        let videoFile = this.videoFileInput.string;
        let videoCount = Number(this.videoCountInput.string);
        videoCount = Math.max(1, videoCount);

        cc.sys.localStorage.setItem('host', host);
        cc.sys.localStorage.setItem('useSSL', useSSL);
        cc.sys.localStorage.setItem('videoCount', videoCount);

        D.Host = host;
        D.UseSSL = useSSL;
        D.ImageFolder = imageFolder;
        D.ImageFile = imageFile;
        D.ImageInterval = imageInterval;
        D.VideoFolder = videoFolder;
        D.VideoFile = videoFile;
        D.VideoCount = videoCount;

        // console.log(D.Host);
        // console.log(D.UseSSL);
        // console.log(D.ImageFolder);
        // console.log(D.ImageFile);
        // console.log(D.ImageInterval);
        // console.log(D.VideoFolder);
        // console.log(D.VideoFile);
        // console.log(D.VideoCount);

        D.RunFromStart = true;
        cc.director.loadScene("Main");
    },

    exitGame() {
        // console.log('退出游戏');
        cc.director.end();
    }
});
