class MyHvHStrategy extends MyStrategy {
    constructor(scene) {
        super(scene);
    }

    apply(possibleMoves) {
        this.game.setState(new MyStateWaiting(this.scene, this.game, possibleMoves));
    }
}