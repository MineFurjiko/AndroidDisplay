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

        videoCountInput: cc.EditBox,
        okButton: cc.Button
    },

    start() {
        let host = cc.sys.localStorage.getItem('host');
        let useSSL = cc.sys.localStorage.getItem('useSSL');
        let videoCount = cc.sys.localStorage.getItem('videoCount');
        let stationId = cc.sys.localStorage.getItem('stationId');

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

        if (stationId == '' || stationId == null) {
            this.stationIdInput.string = D.LocalStationId;
        } else {
            this.stationIdInput.string = Number(stationId);
        }

        this.stationLocalIntervalInput.string = D.LocalUpdateInterval;
        this.stationOtherIntervalInput.string = D.OtherUpdateInterval;
    },

    gotoMain() {
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
    }
});
