class MyStateWaiting extends MyState {
    constructor(scene, game) {
        super(scene, game);
        this.game = game;
        this.initComplete = false;
        this.game.connection.getPossibleMoves(this.game.prologGameState, function(res) {
            this.initComplete = true;
            this.possibleMoves = res.moves;
        }.bind(this));

        /*this.pickedPiece = null;
        this.currentAnimation = null;*/
    }

    canMovePiece(obj) {
        const position = obj.position;
        const canMove = this.possibleMoves.filter(function(move) {
            const initial = MyGame.prologCoordsToJSCoords(move.initial);
            return initial.x == position.x && initial.z == position.z;
        });
        return canMove;
    }

    pickPiece(obj) {
        const canMove = this.canMovePiece(obj);
        if (canMove.length) {
            console.log("Picked piece");
            this.game.board.setPossibleMoves(canMove);
            this.game.setState(new MyStatePiecePicked(this.scene, this.game, obj, canMove));
            return true;
        }
        return false;
    }

    update() {
        // TODO make functions in scene to deal with pickResults in a better way
        if (!this.initComplete) {
            this.scene.discardPickResults();
            return;
        }
        console.log('waiting');
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					const obj = this.scene.pickResults[i][0];
                    const id = this.scene.pickResults[i][1];
					if (id > 81) {
                        if (this.pickPiece(obj)) {
                            this.scene.discardPickResults();
                            return;
                        }
					}
				}
				this.scene.discardPickResults();
			}
        }        
    }
}