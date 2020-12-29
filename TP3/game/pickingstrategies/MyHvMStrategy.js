class MyHvMStrategy extends MyStrategy {
    constructor(game, scene, humanPiece) {
        super(game, scene);
        if (humanPiece != "white" && humanPiece != "black") {
            throw new Error("Invalid human player's piece given to MyHvMStrategy.");
        }
        this.humanPiece = humanPiece;
    }

    apply(possibleMoves) {
        if (this.game.prologGameState.player == this.humanPiece) {
            this.game.setState(new MyStateWaiting(this.scene, this.game, possibleMoves));
        } else {
            this.game.setState(new MyStateMachine(this.scene, this.game));
        }
    }
}