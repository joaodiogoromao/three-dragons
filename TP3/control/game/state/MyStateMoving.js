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

    static createPieceMovingState(scene, game, piece, timeSinceProgramStarted, startPos, endPos) {
        const animation = MyCurveAnimation.createPieceMovingAnimation(piece, timeSinceProgramStarted, startPos, endPos);
        //animation.update(timeSinceProgramStarted);
        return new MyStateMoving(scene, game, [[animation]], function(onStateChange) {
            game.updateBoard(onStateChange);
        });
    }

    update(timeSinceProgramStarted) { 
        console.log('moving');
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
            /* if (!this.cameraAnimation) this.cameraAnimation = new MyCameraAnimation(this.scene, timeSinceProgramStarted, 2);
            
            if (this.cameraAnimation.update(timeSinceProgramStarted)) {
                this.game.nextMoveStrategy.apply();
                this.e = true;
            } */
            this.onAnimationsOver(function() {
                this.finishedAnimations.forEach((animation) => animation.finishedMovingState = true);
            }.bind(this));
            this.ended = true;
        }        
    }
}