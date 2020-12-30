class MyStateMachine extends MyGameState {
    constructor(scene, game) {
        super(scene, game);
        this.game = game;
        this.initComplete = false;
        // request move to perform machine play (get move as a server answer)
        this.game.updateBoard();
        this.game.connection.applyBotMove(this.game.prologGameState, "hard", function(res) {
            this.game.prologGameState = { player: res.player, npieces: res.npieces, gameBoard: res.gameBoard, gameOver: res.gameOver };
            this.move = res.move;
            this.initComplete = true;
        }.bind(this));
    }

    update(timeSinceProgramStarted) {
        console.log('machine picking', this.initComplete);
        if (!this.initComplete) return;

        const endPos = this.move.final;
        const startPos = this.move.initial;
 
        const pickedPiece = this.getPickedPiece(startPos);

        const animation = new MyLinearAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, pickedPiece, 2, 60);
        pickedPiece.animation = animation;

        animation.update(timeSinceProgramStarted);

        this.game.setState(new MyStateMoving(this.scene, this.game, animation));
    }

    getPickedPiece(position) {
        return this.game.board.pieces.find(piece => piece.position != null && piece.position.x == position.x && piece.position.z == position.z);  // TODO change null to the used way to put removed pieces
    }
}