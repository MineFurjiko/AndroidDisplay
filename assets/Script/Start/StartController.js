var FileDownloader = require('FileDownloader');

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

        stationIdInput: cc.EditBox,
        stationLocalIntervalInput: cc.EditBox,
        stationOtherIntervalInput: cc.EditBox,

        videoFolderInput: cc.EditBox,
        videoCountInput: cc.EditBox,
        filesLabel: cc.Label,
        errorLabel: cc.Label,
        okButton: cc.Button
    },

    start() {
        this.updating = false;
        this.oldVideoCount = 1;

        let host = cc.sys.localStorage.getItem('host');
        let useSSL = cc.sys.localStorage.getItem('useSSL');
        let videoCount = cc.sys.localStorage.getItem('videoCount');
        let stationId = cc.sys.localStorage.getItem('stationId');
        let isFirst = cc.sys.localStorage.getItem('isFirst');

        if (isFirst == '' || isFirst == null) {
            this.isFirst = true;
        } else {
            this.isFirst = (isFirst == 'true' ? true : false);
        }

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
            this.oldVideoCount = D.VideoCount;
        } else {
            this.videoCountInput.string = Number(videoCount);
            this.oldVideoCount = Number(videoCount);
        }

        if (stationId == '' || stationId == null) {
            this.stationIdInput.string = D.LocalStationId;
        } else {
            this.stationIdInput.string = Number(stationId);
        }

        this.stationLocalIntervalInput.string = D.LocalUpdateInterval;
        this.stationOtherIntervalInput.string = D.OtherUpdateInterval;

        this.videoFolderInput.string = D.VideoFolder;
    },

    gotoMain() {
        if (this.updating) {
            return;
        }

        if (this.isFirst) {
            this.filesLabel.string = '首次使用需进行视频更新且至少成功1个.'
            return;
        }

        if (this.oldVideoCount < Number(this.videoCountInput.string)) {
            this.filesLabel.string = '视频数目已修改，请重新更新视频.'
            return;
        }


        let host = this.ipInput.string;
        let useSSL = this.ipSSLToggle.isChecked;

        let stationId = Number(this.stationIdInput.string);
        let stationLocalInterval = Number(this.stationLocalIntervalInput.string);
        let stationOtherInterval = Number(this.stationOtherIntervalInput.string);

        let videoCount = Number(this.videoCountInput.string);
        videoCount = Math.max(1, videoCount);

        cc.sys.localStorage.setItem('host', host);
        cc.sys.localStorage.setItem('useSSL', useSSL);
        cc.sys.localStorage.setItem('videoCount', videoCount);
        cc.sys.localStorage.setItem('stationId', stationId);

        D.Host = host;
        D.UseSSL = useSSL;
        D.LocalStationId = stationId;
        D.LocalUpdateInterval = stationLocalInterval;
        D.OtherUpdateInterval = stationOtherInterval;
        D.VideoCount = videoCount;

        D.RunFromStart = true;
        cc.director.loadScene("Main");
    },

    exitGame() {
        cc.director.end();
    },

    onVideoCountInputTextChanged(editbox, customEventData) {
        if (Number(editbox.string) < 1) {
            editbox.string = 1;
        }
    },

    updateLocalVideo() {
        if (this.updating) {
            return;
        }

        let host = this.ipInput.string;
        cc.sys.localStorage.setItem('host', host);

        //清除旧视频
        jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + 'video/');

        let videoCount = Number(this.videoCountInput.string);
        videoCount = Math.max(1, videoCount);
        cc.sys.localStorage.setItem('videoCount', videoCount);
        D.VideoCount = videoCount;

        this.updateHost = this.ipInput.string;
        this.updateVideoFolder = this.videoFolderInput.string;
        this.updateVideoCount = videoCount;
        this.currentDownloadIndex = 0;

        this.errorLabel.string = this.errorString = '';
        this.errorCount = 0;
        this.updating = true;
        this.okButton.interactable = false;

        this.downloadAndSaveVideo();
    },

    downloadAndSaveVideo() {
        if (this.updateHost.charAt(this.updateHost.length - 1) != '/') {
            this.updateHost += '/';
        }
        if (this.updateVideoFolder.charAt(this.updateVideoFolder.length - 1) != '/') {
            this.updateVideoFolder += '/';
        }

        this.filesLabel.string = '正在下载 ' + (this.currentDownloadIndex + 1) + '/' + this.updateVideoCount + ' 个视频文件.';
        let remoteUrl = 'http://' + this.updateHost + this.updateVideoFolder + 'video' + (this.currentDownloadIndex + 1) + '.mp4';

        FileDownloader.download(
            remoteUrl,       //远程视频文件url
            (data) => {     //下载完成后回调
                if (data) {
                    let dirPath = jsb.fileUtils.getWritablePath() + 'video/';
                    let fileName = 'video' + (this.currentDownloadIndex + 1) + '.mp4';
                    let fp = FileDownloader.saveFile(data, dirPath, fileName);  //保存到可写目录下，返回文件地址
                    data = null;
                } else {
                    if (this.errorString.charAt(this.errorString.length - 1) != ',' && this.errorString != '') {
                        this.errorString += ',';
                    }
                    this.errorString += this.currentDownloadIndex + 1;
                    this.errorLabel.string = this.errorString + '号视频下载失败,请重试或检查服务器文件.';
                    this.errorCount++;
                }

                this.currentDownloadIndex++;
                if (this.currentDownloadIndex < this.updateVideoCount) {
                    this.downloadAndSaveVideo();
                } else {
                    this.updating = false;
                    this.okButton.interactable = true;
                    this.filesLabel.string = '更新结束  *' + (this.updateVideoCount - this.errorCount) + '成功  *' + this.errorCount + '失败';
                    this.oldVideoCount = this.updateVideoCount;

                    if (this.updateVideoCount == this.errorCount) {
                        this.isFirst = true;
                        cc.sys.localStorage.setItem('isFirst', true);
                        this.errorLabel.string += '\n**请确保至少一个视频文件更新成功**';
                    } else {
                        this.isFirst = false;
                        cc.sys.localStorage.setItem('isFirst', false);
                    }
                }
            }   //end of callback
        );
    }
});
