

class MyGame {
    constructor(scene, strategy, updateScore, history, movie, getCurrentNextMenu) {
        this.board = scene.game.board;
        this.scene = scene;
        this.updateScore = updateScore;
        this.movie = movie;
        this.history = history;
        this.getCurrentNextMenu = getCurrentNextMenu;

        this.nextMoveStrategy = strategy;
        this.nextMoveStrategy.setGame(this);

        this.connection = new MyConnection('http://localhost:8081/');
        this.connection.init(function(res) {
            this.prologGameState = res;
            this.stopWaitingForStateUpdate();
            this.board.gameBoard = this.prologGameState.gameBoard;
            this.nextMoveStrategy.apply(function() {
                this.initComplete = true;
            }.bind(this));
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
        const appearAnim = this.scene.menus.appearAnimation.copy();
        const disappearAnim = this.scene.menus.disappearAnimation.copy();
        const [currentMenu, nextMenu] = this.getCurrentNextMenu();

        currentMenu.animation = disappearAnim;
        nextMenu.animation = appearAnim;

        disappearAnim.makeStartAtTime(this.timeSinceProgramStarted);
        if (this.scene.cameraLocked) {
            const cameraAnimationDuration = 1;

            const cameraAnimation = new MyCameraAnimation(this.scene, this.timeSinceProgramStarted + disappearAnim.getDuration(), cameraAnimationDuration);
            appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration() + cameraAnimationDuration);

            this.setState(new MyStateMoving(this.scene, this, [[disappearAnim, cameraAnimation, appearAnim]], function() {
                this.nextMoveStrategy.apply();
            }.bind(this)));
        } else {
            appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration());


            this.setState(new MyStateMoving(this.scene, this, [[disappearAnim, appearAnim]], function() {
                this.nextMoveStrategy.apply();
            }.bind(this)));

            this.scene.playerChangesSinceCameraUnlocked++;
        }
    }

    updateBoard(onStateChange, undo = false) {
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
                const evokedCaves = [];
                diff.addedPieces.forEach((piece) => {
                    const appearAnim = this.board.appearAnimation.copy();
                    const disappearAnim = this.board.disappearAnimation.copy();

                    disappearAnim.makeStartAtTime(this.timeSinceProgramStarted);
                    appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration());

                    piece.animation = appearAnim;

                    const cave = this.board.isDragonCavePosition(piece.position);

                    cave.animation = disappearAnim;
                    evokedCaves.push(cave);

                    animations.push([disappearAnim, appearAnim]);   
                });
                this.updateScore(scoreDiff);
                const movingState = new MyStateMoving(this.scene, this, animations, function(onStateChange) {
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
                const piecesToRemove = [];
                diff.removedPieces.forEach((piece) => {
                    const appearAnim = this.board.appearAnimation.copy();
                    const disappearAnim = this.board.disappearAnimation.copy();

                    disappearAnim.makeStartAtTime(this.timeSinceProgramStarted);
                    appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration());

                    piece.animation = disappearAnim;
                    piecesToRemove.push(piece);

                    const cave = this.board.isDragonCavePosition(piece.position);
                    cave.evoked = false;
                    cave.animation = appearAnim;

                    animations.push([disappearAnim, appearAnim]);  
                });
                this.updateScore(scoreDiff);
                const movingState = new MyStateMoving(this.scene, this, animations, function(onStateChange) {
                    piecesToUpdatePosition.forEach((piece) => {
                        piece.position = piece.nextPosition;
                        piece.nextPosition = null;
                    });
                    for (const piece of piecesToRemove) {
                        this.board.pieces.splice(this.board.pieces.indexOf(piece), 1);
                    }
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
        this.board.possibleMoves = null;
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

