class MyStateMachine extends MyGameState {
    constructor(scene, game, difficulty) {
        super(scene, game);
        this.game = game;
        this.difficulty = difficulty;

        // request move to perform machine play (get move as a server answer)
        //this.game.updateBoard();

        //console.log(this.game.prologGameState);
        
        this.game.makeWaitingForStateUpdate();
        this.game.connection.applyBotMove(this.game.prologGameState, difficulty, function(res) {
            this.game.prologGameState = { player: res.player, npieces: res.npieces, gameBoard: res.gameBoard, gameOver: res.gameOver };
            this.move = res.move;
            this.game.stopWaitingForStateUpdate();
        }.bind(this));
    }

    update(timeSinceProgramStarted) {
        console.log('machine picking');
        const endPos = this.move.final;
        const startPos = this.move.initial;
 
        const pickedPiece = this.getPickedPiece(startPos);
        const pieceMovement = MyStateMoving.createPieceMovingState(this.scene, this.game, pickedPiece, timeSinceProgramStarted, startPos, endPos);

        this.game.setState(pieceMovement);
    }

    getPickedPiece(position) {
        return this.game.board.pieces.find(piece => piece.position != null && piece.position.x == position.x && piece.position.z == position.z);  // TODO change null to the used way to put removed pieces
    }
}