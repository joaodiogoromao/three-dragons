class MyStateMoving extends MyGameState {
    constructor(scene, game, currentAnimation) {
        super(scene, game);
        this.game = game;
        this.currentAnimation = currentAnimation;
    }

    update(timeSinceProgramStarted) { 
        console.log('moving');   
        if (this.currentAnimation != null && this.currentAnimation.update(timeSinceProgramStarted) === true) {
            this.game.nextMoveStrategy.apply(function() {
                this.currentAnimation.finishedMovingState = true;
            }.bind(this));
        }
        
    }
}