class MyGameOrchestrator {
    constructor(scene) {
        this.state = new MyStateMainMenu(scene, this);
        this.scene = scene;
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game orchestrator may only be an extension of MyState.");
        this.state = state;
    }

    setPlayingStrategy(strategy) {
        if (!(strategy instanceof MyStrategy)) throw new Error("The game strategy may only be an extension of MyStrategy.");
        this.strategy = strategy;
    }

    setPlayerColor(color) {
        if (!(this.strategy instanceof MyHvMStrategy)) throw new Error("Trying to set player color of a strategy that's not HvM.");
        this.strategy.setPlayerColor(color);
    }

    setStrategyDifficulty(difficulty) {
        if (this.strategy instanceof MyHvHStrategy) throw new Error("Trying to set difficulty of a HvH strategy.");
        this.strategy.setMachineDifficulty(difficulty);
    }

    display() {
        this.state.display();
    }

    update() {
        this.state.update();
    }
}