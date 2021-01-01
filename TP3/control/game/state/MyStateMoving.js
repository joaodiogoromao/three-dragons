class MyStateMoving extends MyGameState {
    constructor(scene, game, currentAnimation) {
        super(scene, game);
        this.game = game;
        this.currentAnimation = currentAnimation;
    }

    update(timeSinceProgramStarted) { 
        console.log('moving');   
        if (this.currentAnimation != null && this.currentAnimation.update(timeSinceProgramStarted) === true) {
            this.scene.cameras.defaultCamera.orbit({X: (1, 0, 0), Y: (0, 1, 0), Z: (0, 0, 1)}, Math.PI);
            this.game.nextMoveStrategy.apply(function() {
                this.currentAnimation.finishedMovingState = true;
            }.bind(this));
        }
        
    }
}