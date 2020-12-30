class MyStrategy {
    constructor(game, scene) {
		if (this.constructor == MyStrategy) {
			throw new Error("MyStrategy is an abstract class. Abstract classes can't be instantiated.");
        }
        this.game = game;
        this.scene = scene;
    }

    apply() {}
}
