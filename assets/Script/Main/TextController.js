cc.Class({
    extends: cc.Component,

    properties: {
        host: '',
        localStationId: 0,
        localUpdateInterval: 8,
        otherUpdateInterval: 10,
        dateLabel: cc.Label,
        localLabels: [cc.Label],
        otherLabels: [cc.Label]
    },

    start() {
        if (D.RunFromStart) {
            this.host = D.Host;

            this.localStationId = D.LocalStationId;
            this.localUpdateInterval = D.LocalUpdateInterval;
            this.otherUpdateInterval = D.OtherUpdateInterval;
        }

        this.currentStationId = 1;

        this.updateDate();
        this.updateLocalStation();
        this.updateOtherStation();
    },

    updateDate() {
        const dateUpdateFun = () => {
            let date = new Date();
            this.dateLabel.string = date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes();
        };
        this.schedule(
            dateUpdateFun,
            60
        );
        dateUpdateFun();
    },

    updateLocalStation() {
        const localStationUpdateFun = () => {
            if (this.localStationId > 0) {
                this.requestApi(
                    'http://' + this.host + '/station_display/public/api/station/' + this.localStationId,
                    (data) => {
                        if (data) {
                            this.localLabels[0].string = data.sname;
                            this.localLabels[1].string = data.rjylsx_qc + '\n\n' + data.rjylsx_mtc;
                            this.localLabels[2].string = data.rjysl_qc + '\n\n' + data.rjysl_mtc;
                            this.localLabels[3].string = data.rsyjyl_qc + '\n\n' + data.rsyjyl_mtc;
                            this.localLabels[4].string = data.sqs_qc + '\n\n' + data.sqs_mtc;
                            this.localLabels[5].string = data.dsh_qc + '\n\n' + data.dsh_mtc;
                        }
                    },
                    null
                );
            }
        }
        this.schedule(
            localStationUpdateFun,
            this.localUpdateInterval
        );
        localStationUpdateFun();
    },

    updateOtherStation() {
        const otherStationUpdateFun = () => {
            if (this.currentStationId > 0) {

                if (this.currentStationId == this.localStationId) {
                    this.currentStationId++;
                    if (this.currentStationId > this.stationCount) {
                        this.currentStationId = 1;
                    }
                }

                this.requestApi(
                    'http://' + this.host + '/station_display/public/api/station/' + this.currentStationId,
                    (data) => {
                        if (data) {
                            this.otherLabels[0].string = data.sname;
                            this.otherLabels[1].string = data.rjylsx_qc + '\n\n' + data.rjylsx_mtc;
                            this.otherLabels[2].string = data.rjysl_qc + '\n\n' + data.rjysl_mtc;
                            this.otherLabels[3].string = data.rsyjyl_qc + '\n\n' + data.rsyjyl_mtc;
                            this.otherLabels[4].string = data.sqs_qc + '\n\n' + data.sqs_mtc;
                            this.otherLabels[5].string = data.dsh_qc + '\n\n' + data.dsh_mtc;
                        }
                    },
                    null
                );
            }

            this.currentStationId++;
            if (this.currentStationId > this.stationCount) {
                this.currentStationId = 1;
            }
        }

        this.requestApi(
            'http://' + this.host + '/station_display/public/api/station/count',
            (data) => {
                if (data) {
                    this.stationCount = data.count;
                    if (this.stationCount < 2) {
                        return;
                    }

                    this.currentStationId = 1;
                    this.schedule(
                        otherStationUpdateFun,
                        this.otherUpdateInterval
                    );
                    otherStationUpdateFun();
                }
            },
            null
        );
    },

    requestApi(url, callback, fail_callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (callback) {
                        callback(xhr.response);
                    }
                } else {
                    if (fail_callback) {
                        fail_callback(xhr.status);
                    }
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.responseType = 'json';
        xhr.send();
    }
});
