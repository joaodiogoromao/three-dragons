
class MyState {
    constructor(scene, game) {
		if (this.constructor == MyState) {
			throw new Error("MyState is an abstract class. Abstract classes can't be instantiated.");
        }
        this.scene = scene;
        this.game = game;
    }

    update(timeSinceProgramStarted) {}
}

