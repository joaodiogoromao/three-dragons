class MyStateMainMenu extends MyState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);
        this.menuController = new MyMenuController(scene, this);

        const mainMenuNode = scene.menus["mainMenu"];
        this.menus = {
            main: mainMenuNode.getLeafNode("main"),
            difficulty: mainMenuNode.getLeafNode("difficulty"),
            choosePlayer: mainMenuNode.getLeafNode("choosePlayer")
        };
        this.gameMode = null;
        this.chosePlayer = null;
    }

    display() {
        console.log(this.chosePlayer, this.gameMode);
        if (this.chosePlayer) this.menus.difficulty.display();
        else if (this.gameMode) this.menus.choosePlayer.display();
        else this.menus.main.display();
    }

    update() {
        this.menuController.update();
    }

    /* ACTIONS */

    goBack() {
        if (this.chosePlayer) {
            this.setPlayerColor(null);
            this.chosePlayer = null;
        }
        else if (this.gameMode) {
            this.setGameStrategy(null);
            this.gameMode = null;
        } 
    }

    advance(difficulty) {
        // HvM and MvM
        if (difficulty)
            this.gameOrchestrator.setStrategyDifficulty(difficulty);
            
        this.gameOrchestrator.setState(new MyStateLoading(this.scene, this.gameOrchestrator));
    }

    setPlayerColor(color) {
        this.gameOrchestrator.setPlayerColor(color);
        this.chosePlayer = true;
    }

    setGameStrategy(strategy) {
        this.gameOrchestrator.setPlayingStrategy(strategy);
        this.gameMode = true;
        if (strategy instanceof MyMvMStrategy) this.chosePlayer = true;
    }
}