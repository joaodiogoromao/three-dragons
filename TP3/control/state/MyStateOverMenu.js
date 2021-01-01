class MyStateOverMenu extends MyState{
    constructor(scene, gameOrchestrator, winner) {
        super(scene, gameOrchestrator);

        this.scene.setMenuCamera();

        this.menuController = new MyMenuController(scene, this);
        
        this.winner = winner;

        const gameOverMenuNode = scene.menus["gameOverMenu"];
        this.menu = gameOverMenuNode.getLeafNode("gameOver");
    }

    goBack() {
        this.gameOrchestrator.setState(new MyStateMainMenu(this.scene, this.gameOrchestrator));
    }

    display() {
        this.menu.display();
    }

    update() {
        console.log("winner:", this.winner);
        this.menuController.update();
    }
}