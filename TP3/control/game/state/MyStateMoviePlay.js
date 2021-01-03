class MyStateMoviePlay extends MyGameState{
    constructor(scene, game) {
        super(scene, game);
        console.log("MOVIE PLAY");
    }

    update(timeSinceProgramStarted) {
        this.game.history.popFirst();
        this.game.prologGameState = this.game.history.first();
        const move = this.game.board.getMove(this.game.prologGameState.gameBoard);
        if (!move) throw new Error("No move found");

        const pieceMovement = MyStateMoving.createPieceMovingState(this.scene, this.game, move.piece, timeSinceProgramStarted, move.startPos, move.endPos);
        this.game.setState(pieceMovement);
    }
}