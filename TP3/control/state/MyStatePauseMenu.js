class MyStatePauseMenu extends MyState{
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.scene.setMenuCamera();
        this.scene.initSceneGraph(this.scene.menus);
    }

    display() {
        
    }

    update() {

    }
}