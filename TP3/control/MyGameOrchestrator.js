class MyGameOrchestrator {
    constructor(scene) {
        this.state = new MyStateMainMenu(scene, this);
        this.scene = scene;
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game orchestrator may only be an extension of MyState.");
        this.state = state;
    }

    display() {
        this.state.display();
    }

    update() {
        this.state.update();
    }
}