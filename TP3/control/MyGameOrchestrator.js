/**
 * @class MyGameOrchestrator
 * Orchestrates the whole game (including menus)
 */
class MyGameOrchestrator {
    /**
     * 
     * @param {CGFscene} scene the scene object
     */
    constructor(scene) {
        this.state = new MyStateMainMenu(scene, this);
        this.scene = scene;
    }

    /**
     * SET method for state
     * @param {MyState} state the state object
     */
    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game orchestrator may only be an extension of MyState.");
        this.state = state;
        this.state.updatedLights = false;
    }

    /**
     * SET method for strategy
     * @param {MyStrategy} strategy the state object
     */
    setPlayingStrategy(strategy) {
        if (!(strategy instanceof MyStrategy) && strategy != null) throw new Error("The game strategy may only be an extension of MyStrategy.");
        this.strategy = strategy;
    }

    /**
     * SET method for player color
     * @param {String} color
     */
    setPlayerColor(color) {
        if (!(this.strategy instanceof MyHvMStrategy) && color != null) throw new Error("Trying to set player color of a strategy that's not HvM.");
        this.strategy.setPlayerColor(color);
    }

    /**
     * SET method for strategy difficulty
     * @param {String} difficulty
     */
    setStrategyDifficulty(difficulty) {
        if (this.strategy instanceof MyHvHStrategy) throw new Error("Trying to set difficulty of a HvH strategy.");
        this.strategy.setMachineDifficulty(difficulty);
    }

    /**
     * Goes back to main menu
     */
    exit() {
        this.setState(new MyStateMainMenu(this.scene, this));
    }

    /**
     * Displays the current state of the game
     */
    display() {
        if (!this.state.updatedLights) {
            if (this.state instanceof MyStatePlaying || this.state instanceof MyStateMovie) {
                this.scene.updateLights(this.scene.sceneGraphs[this.state.sceneGraphIndex].lights);
            } else {
                this.scene.updateLights(this.scene.menus.lights);
            }
            this.state.updatedLights = true;
        }
        this.state.display();
    }

    /**
     * Updates the state
     * @param {Number} timeSinceProgramStarted 
     */
    update(timeSinceProgramStarted) {
        this.state.update(timeSinceProgramStarted);
    }
}