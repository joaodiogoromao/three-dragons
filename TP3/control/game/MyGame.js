

class MyGame {
    constructor(scene, strategy, updateScore, history, movie) {
        this.board = scene.game.board;
        this.scene = scene;
        this.updateScore = updateScore;
        this.movie = movie;
        this.history = history;

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
        this.history.push(this.prologGameState);
        console.log("Prolog state was updated", this.history);
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

    nextPlayer() {
        if (this.scene.cameraLocked) {
            const cameraAnimation = new MyCameraAnimation(this.scene, this.timeSinceProgramStarted, 1);
            this.setState(new MyStateMoving(this.scene, this.game, [[cameraAnimation]], function() {
                this.nextMoveStrategy.apply();
            }.bind(this)));
        } else {
            this.scene.playerChangesSinceCameraUnlocked++;
            this.nextMoveStrategy.apply();
        }
    }

    updateBoard(onStateChange, undo = false) {
        //console.log("Update board called with", onStateChange, this.prologGameState);
        const fn = function() {
            const diff = this.board.setGameBoard(this.prologGameState.gameBoard, undo);

            if (!undo && (diff.removedPieces.length || diff.addedPieces.length)) {

                const animations = [];
                const scoreDiff = { whites: 0, blacks: 0 };
                diff.removedPieces.forEach((piece) => {
                    scoreDiff[piece.player == "white" ? "blacks" : "whites"]++;
                    piece.nextPosition = this.board.getRemovedPiecePosition(piece.player);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                console.log("DIFF: ", diff);
                const evokedCaves = [];
                diff.addedPieces.forEach((piece) => {
                    const appearAnim = this.board.appearAnimation.copy();
                    const disappearAnim = this.board.disappearAnimation.copy();

                    console.log("Dragon animations: ", this.board.appearAnimation, this.board.disappearAnimation, appearAnim, disappearAnim);

                    disappearAnim.makeStartAtTime(this.timeSinceProgramStarted);
                    appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration());
                    console.log("Disappear anim duration: ", disappearAnim.getDuration());
                    console.log("Dragon animations after make start a time " +this.timeSinceProgramStarted+ ": ", this.board.appearAnimation, this.board.disappearAnimation, appearAnim, disappearAnim);

                    piece.animation = appearAnim;

                    const cave = this.board.isDragonCavePosition(piece.position);
                    console.log("Adding dragon: ", piece, cave);
                    cave.animation = disappearAnim;
                    evokedCaves.push(cave);

                    animations.push([disappearAnim, appearAnim]);   
                });
                this.updateScore(scoreDiff);
                const movingState = new MyStateMoving(this.scene, this.game, animations, function(onStateChange) {
                    diff.removedPieces.forEach((piece) => {
                        piece.position = piece.nextPosition;
                        piece.nextPosition = null;
                    });
                    evokedCaves.forEach((cave) => cave.evoked = true);
                    // run camera and toggle player
                    this.nextPlayer();
                    if (onStateChange) onStateChange();  // this is the onStateChange that comes as a parameter to this anonymous function
                }.bind(this));
                this.setState(movingState);

            } else if (undo && (diff.removedPieces.length || diff.movedPieces.length || diff.addedPieces.length)) {

                const animations = [];
                const scoreDiff = { whites: 0, blacks: 0 };
                const piecesToUpdatePosition = [];
                diff.movedPieces.forEach((moved) => {
                    const piece = moved.piece;
                    piece.nextPosition = { x: moved.x, z: moved.z };
                    piecesToUpdatePosition.push(piece);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                diff.addedPieces.forEach((add) => {
                    const piece = this.board.pieces.find((piece) => piece.removed && piece.value == add.value && piece.player == add.player);
                    scoreDiff[piece.player == "white" ? "blacks" : "whites"]--;
                    piece.nextPosition = { x: add.x, z: add.z };
                    piece.removed = null;
                    piecesToUpdatePosition.push(piece);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                diff.removedPieces.forEach((remove) => {
                    // TODO
                });
                this.updateScore(scoreDiff);
                const movingState = new MyStateMoving(this.scene, this.game, animations, function(onStateChange) {
                    piecesToUpdatePosition.forEach((piece) => {
                        console.log(piece);
                        piece.position = piece.nextPosition;
                        piece.nextPosition = null;
                    });
                    // run camera and toggle player
                    this.nextPlayer();
                    if (onStateChange) onStateChange();  // this is the onStateChange that comes as a parameter to this anonymous function
                }.bind(this));
                this.setState(movingState);

            } else {   // If there are no changes simply changes player
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

    undo() {
        if (this.state instanceof MyStateMoving) throw new Error("Trying to undo during animation.");
        this.history.popLast();
        this.prologGameState = this.history.last();
        this.updateBoard(null, true);
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

