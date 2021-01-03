
/**
 * @class MyGame
 * Maneges the entirity of the game (only the game itself)
 */
class MyGame {
    /**
     * @param {CGFscene} scene The scene object
     * @param {MyStrategy} strategy The strategy to be used
     * @param {Function} updateScore Function to be called when the score is to be updated
     * @param {MyHistory} history history object that keeps the games' moves
     * @param {Boolean} movie Whether this is the movie or not
     * @param {Function} getCurrentNextMenu Getter for the current and the next in-game player menus
     */
    constructor(scene, strategy, updateScore, history, movie, getCurrentNextMenu) {
        this.board = scene.game.board;
        this.scene = scene;
        this.updateScore = updateScore;
        this.movie = movie;
        this.history = history;
        this.getCurrentNextMenu = getCurrentNextMenu;

        this.nextMoveStrategy = strategy;
        this.nextMoveStrategy.setGame(this);

        this.connection = new MyConnection('http://localhost:8081/');  // opens the connection
        this.connection.init(function(res) { // gets the initial game state
            this.prologGameState = res;
            this.stopWaitingForStateUpdate();  // stops waiting because the response
            this.board.gameBoard = this.prologGameState.gameBoard;
            this.nextMoveStrategy.apply(function() {
                this.initComplete = true; // init is complete when first move strategy is applied
            }.bind(this));
        }.bind(this));

        this.initComplete = false; // waits for the class to be inited
        this.makeWaitingForStateUpdate();  // waits for the state response
    }

    /**
     * Makes the game wait for a state update. Animations aren't affected.
     */
    makeWaitingForStateUpdate() {
        if (this.stateUpToDate === false) throw new Error("Trying to make game wait for state update, but already waiting.");
        this.stateUpToDate = false;
    }

    /**
     * Stops the wait for a state update
     */
    stopWaitingForStateUpdate() {
        if (this.stateUpToDate === true) throw new Error("Trying to make game stop waiting for state update, but wasn't waiting.");
        this.stateUpToDate = true;
        this.history.push(this.prologGameState);
        if (this.onStateUpToDate) {
            this.onStateUpToDate();
            this.unsetOnStateUpToDate();
        }
    }

    /**
     * Sets a function (fn) to be executed when the state becomes up to date
     * @param {Function} fn 
     */
    setOnStateUpToDate(fn) {
        if (this.onStateUpToDate) throw new Error("Trying to set game onStateUpToDate, but already set."); 
        this.onStateUpToDate = fn;
    }

    /**
     * Unsets the onStateUpToDate function
     */
    unsetOnStateUpToDate() {
        if (this.onStateUpToDate == undefined) throw new Error("Trying to unset game onStateUpToDate, but not set."); 
        this.onStateUpToDate = undefined;
    }

    /**
     * Jumps to the next player, executing the required animations
     */
    nextPlayer() {
        const appearAnim = this.scene.menus.appearAnimation.copy();
        const disappearAnim = this.scene.menus.disappearAnimation.copy();
        const [currentMenu, nextMenu] = this.getCurrentNextMenu();

        currentMenu.animation = disappearAnim;
        nextMenu.animation = appearAnim;

        disappearAnim.makeStartAtTime(this.timeSinceProgramStarted);
        if (this.scene.cameraLocked) {   // animates the menus and the camera
            const cameraAnimationDuration = 1;

            const cameraAnimation = new MyCameraAnimation(this.scene, this.timeSinceProgramStarted + disappearAnim.getDuration(), cameraAnimationDuration);
            appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration() + cameraAnimationDuration);

            this.setState(new MyStateMoving(this.scene, this, [[disappearAnim, cameraAnimation, appearAnim]], function() {
                this.nextMoveStrategy.apply();
            }.bind(this)));
        } else {  // only animates the menus
            appearAnim.makeStartAtTime(this.timeSinceProgramStarted + disappearAnim.getDuration());

            this.setState(new MyStateMoving(this.scene, this, [[disappearAnim, appearAnim]], function() {
                this.nextMoveStrategy.apply();
            }.bind(this)));

            this.scene.playerChangesSinceCameraUnlocked++;
        }
    }

    /**
     * Updated the game board, animating the differences necessary
     * @param {Function} onStateChange function to be executed when the state changes
     * @param {Boolean} undo whether this is due to an undo or not
     */
    updateBoard(onStateChange, undo = false) {
        const fn = function() {
            const diff = this.board.setGameBoard(this.prologGameState.gameBoard, undo);

            /*  When it's not an undo */
            if (!undo && (diff.removedPieces.length || diff.addedPieces.length)) {

                const animations = [];
                const scoreDiff = { whites: 0, blacks: 0 };
                diff.removedPieces.forEach((piece) => {   // removes piece from board and animates it going to axiliary
                    scoreDiff[piece.player == "white" ? "blacks" : "whites"]++;
                    piece.nextPosition = this.board.getRemovedPiecePosition(piece.player);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                const evokedCaves = [];
                diff.addedPieces.forEach((piece) => {  // adds piece to board executing dragon animation
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
                /* Starts the animations */
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
                /* When it is an undo */

                const animations = [];
                const scoreDiff = { whites: 0, blacks: 0 };
                const piecesToUpdatePosition = [];
                /* Moves the piece */
                diff.movedPieces.forEach((moved) => {
                    const piece = moved.piece;
                    piece.nextPosition = { x: moved.x, z: moved.z };
                    piecesToUpdatePosition.push(piece);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                /* Unremoves the piece */
                diff.addedPieces.forEach((add) => {
                    const piece = this.board.pieces.find((piece) => piece.removed && piece.value == add.value && piece.player == add.player);
                    scoreDiff[piece.player == "white" ? "blacks" : "whites"]--;
                    piece.nextPosition = { x: add.x, z: add.z };
                    piece.removed = null;
                    piecesToUpdatePosition.push(piece);
                    animations.push([MyCurveAnimation.createPieceMovingAnimation(piece, this.timeSinceProgramStarted, piece.position, piece.nextPosition)]);
                });
                const piecesToRemove = [];
                /* Removes the added dragon, executing the dragon animation */
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

                // Applies the animations
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

    /**
     * SET method for state
     * @param {MyGameState} state the state object
     */
    setState(state) {
        if (!(state instanceof MyGameState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    /**
     * Undoes a play
     */
    undo() {
        if (this.state instanceof MyStateMoving) throw new Error("Trying to undo during animation.");
        this.board.possibleMoves = null;
        this.history.popLast();
        this.prologGameState = this.history.last();
        this.updateBoard(null, true);
    }

    /**
     * Displays the game
     */
    display() {
        this.scene.game.displayScene();
    }

    /**
     * Updates the game state
     * @param {Number} timeSinceProgramStarted in seconds
     */
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

