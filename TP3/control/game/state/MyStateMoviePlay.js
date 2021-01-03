/**
 * @class MyStateMoviePlay
 * State of the game that corresponds to a game movie play
 * @param {MyScene} scene
 * @param {MyGame} game
 */
class MyStateMoviePlay extends MyGameState{
    constructor(scene, game) {
        super(scene, game);
        console.log("MOVIE PLAY");
    }

    /**
     * @method update 
     * updates the movie game state by getting the first move on the game history and setting the game to a moving state
     * updates the game moves history
     * @param timeSinceProgramStarted
     */
    update(timeSinceProgramStarted) {
        this.game.history.popFirst();
        this.game.prologGameState = this.game.history.first();
        const move = this.game.board.getMove(this.game.prologGameState.gameBoard);
        if (!move) throw new Error("No move found");

        const pieceMovement = MyStateMoving.createPieceMovingState(this.scene, this.game, move.piece, timeSinceProgramStarted, move.startPos, move.endPos);
        this.game.setState(pieceMovement);
    }
}