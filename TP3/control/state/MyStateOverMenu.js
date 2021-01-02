class MyStateOverMenu extends MyState{
    constructor(scene, gameOrchestrator, winner) {
        super(scene, gameOrchestrator);

        this.scene.setMenuCamera();

        this.menuController = new MyMenuController(scene, this);
        
        this.winner = winner.charAt(0).toUpperCase() + winner.substring(1, winner.length);

        const gameOverMenuNode = scene.menus["gameOverMenu"];
        this.menu = gameOverMenuNode.getLeafNode("gameOver");

        this.menu.obj.setTitle(this.winner + " wins!");
    }

    goBack() {
        this.scene.graph.board.reset();   
        this.gameOrchestrator.setState(new MyStateMainMenu(this.scene, this.gameOrchestrator));
    }

    display() {
        this.menu.display();
    }

    update() {
        this.menuController.update();
    }
}