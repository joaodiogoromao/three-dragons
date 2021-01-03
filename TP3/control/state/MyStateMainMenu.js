/**
 * @class MyStateMainMenu
 * State of the program where user is in main menu selection
 */
class MyStateMainMenu extends MyState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.scene.setMenuCamera();
        this.scene.initSceneGraph(this.scene.menus);

        this.menuController = new MyMenuController(scene, this);

        const mainMenuNode = scene.menus.nodes["mainMenu"];
        this.menus = {
            main: mainMenuNode.getLeafNode("main"),
            difficulty: mainMenuNode.getLeafNode("difficulty"),
            choosePlayer: mainMenuNode.getLeafNode("choosePlayer")
        };
        
        this.gameMode = null;
        this.chosePlayer = null;
    }

    /**
     * @method display
     * Display the main menu selection
     */
    display() {
        if (this.chosePlayer) this.menus.difficulty.display();
        else if (this.gameMode) this.menus.choosePlayer.display();
        else this.menus.main.display();
    }

    /**
     * @method update
     * Redirects to menu controller update method
     */
    update() {
        this.menuController.update();
    }

    /* ACTIONS */

    /**
     * @method goBack
     * Goes back to previous main menu selection
     */
    goBack() {
        if (this.chosePlayer) {
            if (this.gameOrchestrator.strategy instanceof MyMvMStrategy)
                this.gameMode = null;
            else
                this.setPlayerColor(null);
            this.chosePlayer = null;
        }
        else if (this.gameMode) {
            this.setGameStrategy(null);
            this.gameMode = null;
        } 
    }

    /**
     * @method advance
     * Advances to the game
     * All user selection were performed at this point
     */
    advance(difficulty) {
        // HvM and MvM
        if (difficulty)
            this.gameOrchestrator.setStrategyDifficulty(difficulty);
        
        this.scene.setGameCamera();
        this.gameOrchestrator.setState(new MyStatePlaying(this.scene, this.gameOrchestrator));
    }

    /**
     * @method setPlayerColor
     * When user has selected HvM game mode interprets the color selcion
     */
    setPlayerColor(color) {
        this.gameOrchestrator.setPlayerColor(color);
        this.chosePlayer = true;
    }

    /**
     * @method setGameStrategy
     * Sets the game mode selected by the user as well as bots strategies
     */
    setGameStrategy(strategy) {
        this.gameOrchestrator.setPlayingStrategy(strategy);
        this.gameMode = true;
        if (strategy instanceof MyMvMStrategy) this.chosePlayer = true;
    }
}