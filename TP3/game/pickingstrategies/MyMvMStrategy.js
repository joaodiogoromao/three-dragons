class MyMvMStrategy extends MyStrategy {
    constructor(game, scene) {
        super(game, scene);
    }

    apply() {
        this.game.setState(new MyStateMachine(this.scene, this.game));
    }
}