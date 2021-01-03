/**
 * @class MyHvHStrategy
 * Implements the strategy for the Human vs Human game mode.
 */
class MyHvHStrategy extends MyStrategy {
    /**
     * @param {CGFscene} scene the scene object
     */
    constructor(scene) {
        super(scene);
    }

    /**
     * Applies the strategy to the current game, by calling the super 'apply' method
     * @param {Function} extender optional function that is executed in the end
     */
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