class MyStateOverMenu extends MyState{
    constructor(scene, gameOrchestrator, winner, history) {
        super(scene, gameOrchestrator);

        this.scene.setMenuCamera();
        this.scene.initSceneGraph(this.scene.menus);

        this.menuController = new MyMenuController(scene, this);
        
        this.winner = winner.charAt(0).toUpperCase() + winner.substring(1, winner.length);
        this.history = history;

        const gameOverMenuNode = scene.menus.nodes["gameOverMenu"];
        this.menu = gameOverMenuNode.getLeafNode("gameOver");

        this.menu.obj.setTitle(this.winner + " wins!");
    }

    goBack() {
        this.scene.game.board.reset();
        this.gameOrchestrator.setState(new MyStateMainMenu(this.scene, this.gameOrchestrator));
    }

    seeGameMovie() {
        this.scene.game.board.reset();
        this.scene.setGameCamera();
        
        if (this.history.history.length != 0) {
            console.log("Not empty");
            this.gameOrchestrator.history = new MyHistory([...this.history.history]);
            this.gameOrchestrator.setState(new MyStateMovie(this.scene, this.gameOrchestrator, this.history));
        }
        else if (this.gameOrchestrator.history) {
            console.log("empty")
            const history = new MyHistory([...this.gameOrchestrator.history.history]);
            this.gameOrchestrator.setState(new MyStateMovie(this.scene, this.gameOrchestrator, history));

        }
    }

    display() {
        this.menu.display();
    }

    update() {
        this.menuController.update();
    }
}