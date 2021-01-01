class MyMvMStrategy extends MyStrategy {
    constructor(scene) {
        super(scene);
    }

    apply(extender) {
        const fn = function() {
            this.game.setState(new MyStateMachine(this.scene, this.game, this.difficulty));
        }.bind(this);
        super.apply(fn, extender);
    }

    setMachineDifficulty(difficulty) {
        this.difficulty = difficulty;
    }
}