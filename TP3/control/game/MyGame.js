

class MyGame {
    constructor(scene, strategy, updateScore) {
        this.board = scene.game.board;
        this.scene = scene;
        this.updateScore = updateScore;

        this.nextMoveStrategy = strategy;
        this.nextMoveStrategy.setGame(this);

        this.connection = new MyConnection('http://localhost:8081/');
        this.connection.init(function(res) {
            this.prologGameState = res;
            this.stopWaitingForStateUpdate();
            this.board.gameBoard = this.prologGameState.gameBoard;
            console.log("stopped waiting");
            this.nextMoveStrategy.apply(function() {
                this.initComplete = true;
            }.bind(this));
            console.log("applied");
        }.bind(this));

        this.initComplete = false;
        this.makeWaitingForStateUpdate();
    }

    makeWaitingForStateUpdate() {
        if (this.stateUpToDate === false) throw new Error("Trying to make game wait for state update, but already waiting.");
        this.stateUpToDate = false;
    }

    stopWaitingForStateUpdate() {
        if (this.stateUpToDate === true) throw new Error("Trying to make game stop waiting for state update, but wasn't waiting.");
        this.stateUpToDate = true;
        if (this.onStateUpToDate) {
            this.onStateUpToDate();
            this.unsetOnStateUpToDate();
        }
    }

    setOnStateUpToDate(fn) {
        if (this.onStateUpToDate) throw new Error("Trying to set game onStateUpToDate, but already set."); 
        this.onStateUpToDate = fn;
    }

    unsetOnStateUpToDate() {
        if (this.onStateUpToDate == undefined) throw new Error("Trying to unset game onStateUpToDate, but not set."); 
        this.onStateUpToDate = undefined;
    }

    nextPlayer(moveCamera = true) {
        if (moveCamera) {
            const cameraAnimation = new MyCameraAnimation(this.scene, this.timeSinceProgramStarted, 2);
            this.setState(new MyStateMoving(this.scene, this.game, [[cameraAnimation]], function() {
                this.nextMoveStrategy.apply();
            }.bind(this)));
        } else {
            this.nextMoveStrategy.apply();
        }
    }

    updateBoard(onStateChange) {
        console.log("Update board called with", onStateChange, this.prologGameState);
        const fn = function() {
            const removedPieces = this.board.setGameBoard(this.prologGameState.gameBoard);
            // this will return the removed pieces animations in order to create a new my state moving state and animate their exit
            // if animate then set animation state
            // else, animate camera:
            if (removedPieces.length) {
                const animations = [];
                const scoreDiff = { whites: 0, blacks: 0 };
                removedPieces.forEach((piece) => {
                    scoreDiff[piece.player == "white" ? "blacks" : "whites"]++;
                    piece.nextPosition = this.board.getRemovedPiecePosition(piece.player);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                this.updateScore(scoreDiff);
                const movingState = new MyStateMoving(this.scene, this.game, animations, function(onStateChange) {
                    removedPieces.forEach((piece) => {
                        piece.position = piece.nextPosition;
                        piece.nextPosition = null;
                    });
                    this.nextPlayer();
                    onStateChange();
                    // run camera and toggle player
                }.bind(this));
                this.setState(movingState);
            } else {
                this.nextPlayer();
            }

            if (onStateChange) onStateChange();
        }.bind(this);

        if (this.stateUpToDate) {
            fn();
        } else {
            this.setOnStateUpToDate(fn);
        }
    }

    setState(state) {
        if (!(state instanceof MyGameState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    display() {
        this.scene.game.displayScene();
    }

    update(timeSinceProgramStarted) {
        this.timeSinceProgramStarted = timeSinceProgramStarted;
        if (!this.initComplete) return;
        if (!(this.state instanceof MyStateMoving) && !this.stateUpToDate) return;  // if the state is not an animation, all server requests must have been fulfilled 
        this.state.update(timeSinceProgramStarted);
        if (!(this.state instanceof MyStateMoving)) {
            if (this.prologGameState.gameOver) return true;
        }
    }

}

