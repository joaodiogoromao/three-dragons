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
        this.game.update(timeSinceProgramStarted);
    }
}