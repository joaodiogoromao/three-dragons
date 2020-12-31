class MyStateOverMenu extends MyState{
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);
        const gameOverMenuNode = scene.menus["gameOverMenu"];
        this.menu = gameOverMenuNode.getLeafNode("gameOver");
    }

    display() {
        this.menu.display();
    }

    update() {

    }
}