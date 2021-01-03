/**
 * @class MyStateOverMenu
 * State of the program where the game has finished
 * Redirects user either to main menu or game movie
 * Displays the winner
 */
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

    /**
     * @method seeGameMovie
     * Advances to game movie state
     */
    seeGameMovie() {
        this.scene.game.board.reset();
        this.scene.setGameCamera();
        
        if (this.history.history.length != 0) {
            this.gameOrchestrator.history = new MyHistory([...this.history.history]);
            this.gameOrchestrator.setState(new MyStateMovie(this.scene, this.gameOrchestrator, this.history));
        }
        else if (this.gameOrchestrator.history) {
            const history = new MyHistory([...this.gameOrchestrator.history.history]);
            this.gameOrchestrator.setState(new MyStateMovie(this.scene, this.gameOrchestrator, history));

        }
    }

    /**
     * @method display
     * displays the game over menu
     */
    display() {
        if (!this.setLights) {
            this.scene.setLights(this.scene.menus.lights);
            this.setLights = true;
        }
        this.menu.display();
    }

    /**
     * @mthod update
     * Updates the game over controller
     */
    update() {
        this.menuController.update();
    }
}