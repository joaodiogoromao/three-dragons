class MyHvHStrategy extends MyStrategy {
    constructor(game, scene) {
        super(game, scene);
    }

    apply(possibleMoves) {
        this.game.setState(new MyStateWaiting(this.scene, this.game, possibleMoves));
    }
}