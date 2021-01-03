class MyHvHStrategy extends MyStrategy {
    constructor(scene) {
        super(scene);
    }

    apply(extender) {
        const fn = function() {
            if (this.game.movie)
                this.game.setState(new MyStateMoviePlay(this.scene, this.game));
            else
                this.game.setState(new MyStateWaiting(this.scene, this.game));
        }.bind(this);
        super.apply(fn, extender);
    }
}