class MyStrategy {
    constructor(scene) {
		if (this.constructor == MyStrategy) {
			throw new Error("MyStrategy is an abstract class. Abstract classes can't be instantiated.");
        }
        this.scene = scene;
    }

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

    setGame(game) {
        if (!(game instanceof MyGame)) throw new Error("The game of the game strategy may only be an extension of MyGame.");
        this.game = game;
    }
}
