class MyMvMStrategy extends MyStrategy {
    constructor(scene) {
        super(scene);
    }

    apply() {
        this.game.setState(new MyStateMachine(this.scene, this.game, this.difficulty));
    }

    setMachineDifficulty(difficulty) {
        this.difficulty = difficulty;
    }
}