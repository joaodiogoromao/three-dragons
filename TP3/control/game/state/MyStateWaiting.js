/**
 * @class MyStateWaiting
 * State of the game that wait for piece selection redirecting to MyStatePiecePicked when so
 * Responsible getting the player piece selection
 * @param {MyScene} scene
 * @param {MyGame} game
 * @param {Array} possibleMoves Array of possible moves associated to the picked piece
 */
class MyStateWaiting extends MyGameState {
    constructor(scene, game, possibleMoves) {
        super(scene, game);
        this.game = game;
        this.initComplete = false;
        if (possibleMoves) {
            this.possibleMoves = possibleMoves;
            this.initComplete = true;
        } else if (game.stateUpToDate) {
            this.init();
        } else {
            this.game.setOnStateUpToDate(this.init.bind(this));
        }
    }

    /**
     * @method canMovePiece
     * Verifies if object given as parameter can be moved
     */
    canMovePiece(obj) {
        const position = obj.position;
        const canMove = this.possibleMoves.filter(function(move) {
            const initial = move.initial;
            return initial.x == position.x && initial.z == position.z;
        });
        return canMove;
    }

    /**
     * @method init
     * Gets all the possible moves associated with current state of the game
     */
    init() {
        this.game.connection.getPossibleMoves(this.game.prologGameState, function(res) {
            this.initComplete = true;
            this.possibleMoves = res.moves;
        }.bind(this));
    }

    /**
     * @method pickPiece
     * Sets picked piece posiible moves to game
     * Advances to new state if piece can be moved
     */
    pickPiece(obj) {
        const canMove = this.canMovePiece(obj);
        if (canMove.length) {
            this.game.board.setPossibleMoves(canMove);
            this.game.setState(new MyStatePiecePicked(this.scene, this.game, obj, this.possibleMoves));
            return true;
        }
        return false;
    }

    /**
     * @method update Interprets player picking
     * Waits for piece selection
     * Once the move is obtained sends server requests to perform move
     */
    update() {
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