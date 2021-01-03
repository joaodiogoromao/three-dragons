/**
 * Abstract Class MyStrategy
 *
 * @class MyStrategy
 * Chooses the next GameState to which the game changes
 */
class MyStrategy {
    /**
     * 
     * @param {CGFscene} scene the scene object
     */
    constructor(scene) {
		if (this.constructor == MyStrategy) {
			throw new Error("MyStrategy is an abstract class. Abstract classes can't be instantiated.");
        }
        this.scene = scene;
    }

    /**
     * Function that receives a function (fn) that is executed if/when the game has its state updated
     * @param {Function} fn Function that is executed 
     * @param {Function} extender Optional extender function, executed after fn
     */
    apply(fn, extender) {
        const exec = function() {
            fn();
            if (extender) extender();
        };
        if (!this.game.stateUpToDate) {
            console.log("State was not up to date in strategy apply!")
            this.game.setOnStateUpToDate(exec);
        } 
        else exec();
    }

    /**
     * SET method for game
     * @param {MyGame} game the game object
     */
    setGame(game) {
        if (!(game instanceof MyGame)) throw new Error("The game of the game strategy may only be an extension of MyGame.");
        this.game = game;
    }
}
