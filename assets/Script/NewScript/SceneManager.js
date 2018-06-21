cc.Class({
    extends: cc.Component,

    start() {
        this.clickCount = 0;
    },

    backToStart() {
        this.clickCount++;

        if (this.clickCount >= 7) {
            this.clickCount = 0;
            cc.director.loadScene("Start");
        }
    }
});
