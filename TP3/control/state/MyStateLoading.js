class MyStateLoading extends MyState{
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);
        this.game = MyGame(scene);
    }

    display() {
        
    }
}