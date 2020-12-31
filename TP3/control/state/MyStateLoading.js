class MyStateLoading extends MyState{
    constructor(scene, gameOrchestrator) {
        console.log("playing");
        super(scene, gameOrchestrator);
        this.game = new MyGame(scene);
    }

    display() {
        
    }

    update() {

    }
}