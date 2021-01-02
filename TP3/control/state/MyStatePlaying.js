class MyStatePlaying extends MyState {
    constructor(scene, gameOrchestrator) {
        console.log("playing");
        super(scene, gameOrchestrator);
        this.game = new MyGame(scene, gameOrchestrator.strategy, this.updateScore.bind(this));

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
        this.game.display();
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

        if (this.game.state instanceof MyStateMoving) { // stops the timer as soon as the player moves a piece
            if (this.timeLeftInterval) clearInterval(this.timeLeftInterval);
            this.timeLeftInterval = null;
        } else {
            const player = this.getCurrentPlayer();
            if (player != this.activeMenu.player) {
                this.setActivePlayerMenu(player);
            }
            this.menuController.update(false);
        }
        if (this.game.update(timeSinceProgramStarted)) {
            this.gameOrchestrator.setState(new MyStateOverMenu(this.scene, this.gameOrchestrator, this.game.prologGameState.gameOver));
        }
    }

    setButtonInAllMenus(buttonName, value) {
        this.menus.forEach((menu) => menu.setButtonValue(buttonName, String(value)));
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

    updateTimeLeft() {
        this.activeMenu.menu.setButtonValue("playTimeLeft", this.playTimeLeft.toString() + "s");
        this.playTimeLeft--;

        if (this.playTimeLeft == -1) {
            this.game.nextPlayer();
            
            const nextPlayer = this.activeMenu.player == "white" ? "black" : "white";
            this.game.prologGameState.player = nextPlayer;
        }
    }

    setActivePlayerMenu(player) {
        if (this.timeLeftInterval) throw new Error("Trying to set new interval when an interval was already set.");
        this.timeLeftInterval = setInterval(this.updateTimeLeft.bind(this), 1000);
        if (player === "white") {
            this.activeMenu = { player: player, menu: this.whitesMenu };
        }
        else if (player === "black") {
            this.activeMenu = { player: player, menu: this.blacksMenu };
        }
        this.playTimeLeft = 30;
        this.activeMenu.menu.setButtonValue("playTimeLeft", "30s");
    }
}