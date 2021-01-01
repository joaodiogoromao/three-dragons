class MyHvHStrategy extends MyStrategy {
    constructor(scene) {
        super(scene);
    }

    apply(extender) {
        const fn = function() {
            this.game.setState(new MyStateWaiting(this.scene, this.game));
        }.bind(this);
        super.apply(fn, extender);
    }
}