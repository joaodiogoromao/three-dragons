/**
 * @class MyState
 * Represents state of the program
 * Managed by game orchestrator
 */
class MyState {
    constructor(scene, gameOrchestrator) {
		if (this.constructor == MyState) {
			throw new Error("MyState is an abstract class. Abstract classes can't be instantiated.");
        }
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;
    }

    display() {}

    update(timeSinceProgramStarted) {}
}

