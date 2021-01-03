/**
 * @class MyStateMoving
 * State of the game that corresponds to the movement of a piece, camera transition and score board animation
 * Responsible for in game animations
 * @param {MyScene} scene
 * @param {MyGame} game
 */
class MyStateMoving extends MyGameState {
    constructor(scene, game, animations, onAnimationsOver) {
        /*
         * !! IMPORTANT
         * The onAnimationsOver function receives another function as argument.
         * That other function should be executed once the game's state changes from moving to any other 
         */

        super(scene, game);
        this.animations = animations;
        this.onAnimationsOver = onAnimationsOver;
        this.finishedAnimations = [];
    }

    /**
     * @method createPieceMovingState
     * Creates an instance of MyStateMoving
     * @param {MyScene} scene
     * @param {MyGame} game
     * @param {Object} piece Piece object to be animated
     * @param {Number} timeSinceProgramStarted
     * @param {Object} startPos Intial position of the piece animation
     * @param {Object} endPos Final position of the piece animation
     */
    static createPieceMovingState(scene, game, piece, timeSinceProgramStarted, startPos, endPos) {
        const animation = MyCurveAnimation.createPieceMovingAnimation(piece, timeSinceProgramStarted, startPos, endPos);
        //animation.update(timeSinceProgramStarted);
        return new MyStateMoving(scene, game, [[animation]], function(onStateChange) {
            game.updateBoard(onStateChange);
        });
    }

    /**
     * @method update updates the piece movement
     * redirects to the correspondent game state, depending on the game strategy once the piece movement has finished
     * @param timeSinceProgramStarted
     */
    update(timeSinceProgramStarted) {
        if (this.ended) return;

        const remove = [];
        for (const i in this.animations) {
            const animationSequence = this.animations[i];
            if (animationSequence.length == 0) remove.push(i);
            else if (animationSequence[0].update(timeSinceProgramStarted)) {
                this.finishedAnimations.push(animationSequence.splice(0, 1)[0]);
            }
        }
        remove.forEach((i) => this.animations.splice(i, 1));


        if (!this.animations.length) {
            this.onAnimationsOver(function() {
                this.finishedAnimations.forEach((animation) => animation.finishedMovingState = true);
            }.bind(this));
            this.ended = true;
        }        
    }
}