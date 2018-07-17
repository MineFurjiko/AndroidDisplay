cc.Class({
    extends: cc.Component,

    properties: {
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
        interval: {
            default: 8
        },
        imageSprite: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:
    start() {
        this.protocol = 'http://';

        if (D.RunFromStart) {
            // console.log('run from start!');

            this.useSSL = D.UseSSL;
            this.host = D.Host;
            this.folder = D.ImageFolder;
            this.fileName = D.ImageFile;
            this.interval = D.ImageInterval;
        }

        if (this.host.charAt(this.host.length - 1) != '/') {
            this.host += '/';
        }
        if (this.folder.charAt(this.folder.length - 1) != '/') {
            this.folder += '/';
        }

        // this.protocol = this.useSSL ? 'https://' : 'http://';

        const getImageSchedule = () => {
            let remoteUrl = this.protocol + this.host + this.folder + this.fileName + '?v=' + cc.rand();
            cc.loader.load(remoteUrl, (err, texture) => {
                if (err) {
                    // this.unschedule(getImageSchedule);
                    return;
                }
                // console.log('get image from' + remoteUrl);
                // console.log(this.oldUrl);

                let sp = new cc.SpriteFrame(texture);

                let imageRatio = 1080 / texture.width;

                cc.loader.release(this.oldUrl);
                cc.loader.release(this.imageSprite.spriteFrame._texture);
                cc.loader.release(this.imageSprite.spriteFrame);
                this.imageSprite.spriteFrame = null;
                this.imageSprite.spriteFrame = sp;

                this.node.setScale(imageRatio, imageRatio);

                this.oldUrl = remoteUrl;
            });
        };

        getImageSchedule();

        this.schedule(
            getImageSchedule,
            this.interval
        );
    }
});
