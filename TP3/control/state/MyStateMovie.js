class MyStateMovie extends MyState {
    constructor(scene, gameOrchestrator, history) {
        console.log("movie");
        super(scene, gameOrchestrator);
        this.history = history;

        this.game = new MyGame(scene, gameOrchestrator.strategy, this.updateScore.bind(this), this.history, true);
        this.game.setState(new MyStateMoviePlay(this.scene, this.game));

        this.sceneGraphIndex = 0;

        this.playTimeLeft = 30;

        this.score = {
            whites: 0,
            blacks: 0
        }

        this.menuController = new MyMenuController(scene, this);

        this.whitesMenuNode = scene.menus["whitesMenu"];
        this.whitesMenu = this.whitesMenuNode.getLeafNode("whites").obj;

        this.blacksMenuNode = scene.menus["blacksMenu"];
        this.blacksMenu = this.blacksMenuNode.getLeafNode("blacks").obj;

        this.menus = [this.whitesMenu, this.blacksMenu];

        this.setActivePlayerMenu("white");
    }

    display() {
        // Display scene
        this.scene.sceneGraphs[this.sceneGraphIndex].displayScene();

        // Display game elements
        this.game.display();

        // Display game menus
        if (!this.game.initComplete) return;
        if (this.getCurrentPlayer() == "white") this.whitesMenuNode.display();
        else if (this.getCurrentPlayer() == "black") this.blacksMenuNode.display();
    }

    getCurrentPlayer() {
        if (this.game.state instanceof MyStateWaiting || (this.game.state instanceof MyStateMachine && !this.game.stateUpToDate)) {
            return this.game.prologGameState.player;
        }
        return this.activeMenu.player;
    }

    update(timeSinceProgramStarted) {
        if (!this.game.initComplete) return;

        if (!(this.game.state instanceof MyStateMoving)) {
            const player = this.getCurrentPlayer();
            if (player != this.activeMenu.player) {
                this.setActivePlayerMenu(player);
            }
            this.menuController.update(false);
        }
        if (this.game.update(timeSinceProgramStarted)) {
            this.gameOrchestrator.setState(new MyStateOverMenu(this.scene, this.gameOrchestrator, this.game.prologGameState.gameOver, new MyHistory([])));
        }
    }

    setButtonInAllMenus(buttonName, value) {
        this.menus.forEach((menu) => menu.setButtonValue(buttonName, String(value)));
    }

    setSceneGraphIndex(sceneGraphIndex) {
        this.sceneGraphIndex = sceneGraphIndex;
    }

    updateScore(scoreDiff) {
        if (scoreDiff.whites > 0) {
            this.score.whites += scoreDiff.whites;
            this.setButtonInAllMenus("whitesScore", this.score.whites);
        }
        if (scoreDiff.blacks > 0) {
            this.score.blacks += scoreDiff.blacks;
            this.setButtonInAllMenus("blacksScore", this.score.blacks);
        }
    }

    setActivePlayerMenu(player) {
        if (this.timeLeftInterval) throw new Error("Trying to set new interval when an interval was already set.");
        if (player === "white") {
            this.activeMenu = { player: player, menu: this.whitesMenu };
        }
        else if (player === "black") {
            this.activeMenu = { player: player, menu: this.blacksMenu };
        }
    }
}