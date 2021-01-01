class MyStateLoading extends MyState{
    constructor(scene, gameOrchestrator) {
        console.log("playing");
        super(scene, gameOrchestrator);
        this.game = new MyGame(scene, gameOrchestrator.strategy);
    }

    display() {
        this.game.display();
    }

    update(timeSinceProgramStarted) {
        if (this.game.update(timeSinceProgramStarted)) {
            this.gameOrchestrator.setState(new MyStateOverMenu(this.scene, this.gameOrchestrator, this.game.prologGameState.gameOver));
        }
    }
}