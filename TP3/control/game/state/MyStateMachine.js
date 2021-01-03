/**
 * @class MyStateMachine
 * State of the game that corresponds to a machine play
 * @param {MyScene} scene
 * @param {MyGame} game
 * @param {String} difficulty Difficulty of the machine that is playing
 */
class MyStateMachine extends MyGameState {
    constructor(scene, game, difficulty) {
        super(scene, game);
        this.game = game;
        this.difficulty = difficulty;
        
        this.game.makeWaitingForStateUpdate();
        this.game.connection.applyBotMove(this.game.prologGameState, difficulty, function(res) {
            this.game.prologGameState = { player: res.player, npieces: res.npieces, gameBoard: res.gameBoard, gameOver: res.gameOver };
            this.move = res.move;
            this.game.stopWaitingForStateUpdate();
        }.bind(this));
    }

    /**
     * @method update updates the machine game state by getting the selected piece and setting the game to a moving state
     * @param timeSinceProgramStarted
     */
    update(timeSinceProgramStarted) {
        const endPos = this.move.final;
        const startPos = this.move.initial;
 
        const pickedPiece = this.getPickedPiece(startPos);
        const pieceMovement = MyStateMoving.createPieceMovingState(this.scene, this.game, pickedPiece, timeSinceProgramStarted, startPos, endPos);

        this.game.setState(pieceMovement);
    }

    /**
     * @method getPickedPiece gets the selected piece of the machine strategy given its position
     * @param {Object} position
     */
    getPickedPiece(position) {
        return this.game.board.pieces.find(piece => piece.position != null && piece.position.x == position.x && piece.position.z == position.z);  // TODO change null to the used way to put removed pieces
    }
}