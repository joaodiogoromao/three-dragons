class MyStatePiecePicked extends MyState {
    constructor(scene, game, piece, possibleMoves) {
        super(scene, game);
        this.piece = piece;
        this.possibleMoves = possibleMoves;
    }

    update(timeSinceProgramStarted) {
        console.log('waiting for place');

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {

					const obj = this.scene.pickResults[i][0];
                    const id = this.scene.pickResults[i][1];

                    // verify if picked object is a tile
                    if (id <= 81) {
                        if (this.pickTile(obj, id, timeSinceProgramStarted)) {
                            this.scene.discardPickResults();
                            return;
                        }
                    } else {
                        this.game.setState(new MyStateWaiting(this.scene, this.game, this.possibleMoves));
                        this.resetPossibleMoves();
                        return;
                    }
                }
                this.scene.discardPickResults();
            }
        }
    }

    resetPossibleMoves() {
        this.game.board.setPossibleMoves(null);
    }

    pickTile(obj, id, timeSinceProgramStarted) {
        const startPos = this.piece.position;
        const endPos = { x: ((id-1)%9)+1, z: Math.floor((id-1)/9)+1 };

        if (isNaN(endPos.x) || isNaN(endPos.z)) return false;

        const move = this.isValidMove(startPos, endPos, this.piece);
        if (!move) return false;

        const animation = new MyLinearAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, this.pickedPiece, 2, 60);
        this.piece.animation = animation;

        animation.update(timeSinceProgramStarted);

        this.piece.position = endPos;
        this.piece = null;

        // send server request (move)
        this.game.makeWaitingForStateUpdate();
        this.game.connection.applyMove(this.game.prologGameState, move, function(res) {
            this.game.prologGameState = res;
            this.game.stopWaitingForStateUpdate();
        }.bind(this));

        this.game.setState(new MyStateMoving(this.scene, this.game, animation));
        this.resetPossibleMoves();

        return true;
    }

    isValidMove(startPos, endPos, piece) {
        console.log(piece.id);
        return this.possibleMoves.find(function(move) {
            const initial = MyGame.prologCoordsToJSCoords(move.initial);
            const final = MyGame.prologCoordsToJSCoords(move.final);

            return initial.x == startPos.x && initial.z == startPos.z &&
                final.x == endPos.x && final.z == endPos.z;
        });
    }
}