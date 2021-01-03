class MyStateMovie extends MyState {
    constructor(scene, gameOrchestrator, history) {
        console.log("movie");
        super(scene, gameOrchestrator);
        this.history = history;

        this.game = new MyGame(scene, gameOrchestrator.strategy, this.updateScore.bind(this), this.history, true, this.getCurrentNextMenu.bind(this));
        this.game.setState(new MyStateMoviePlay(this.scene, this.game));

        this.sceneGraphIndex = 0;
        this.scene.initSceneGraph(this.sceneGraphIndex);

        this.playTimeLeft = 30;

        this.score = {
            whites: 0,
            blacks: 0
        }

        this.menuController = new MyMenuController(scene, this);

        this.whitesMenuNode = scene.menus.nodes["whitesMenu"];
        this.whitesMenu = this.whitesMenuNode.getLeafNode("whites").obj;

        this.blacksMenuNode = scene.menus.nodes["blacksMenu"];
        this.blacksMenu = this.blacksMenuNode.getLeafNode("blacks").obj;

        this.menus = [ 
            { player: "white", menu: this.whitesMenu, node: this.whitesMenuNode }, 
            { player: "black", menu: this.blacksMenu, node: this.blacksMenuNode } 
        ];

        this.setActivePlayerMenu("white");
    }

    getCurrentNextMenu() {
        return [ this.activeMenu.menu, this.menus.find(menu => menu.player != this.activeMenu.player).menu ];
    }

    display() {
        // Display scene
        this.scene.sceneGraphs[this.sceneGraphIndex].displayScene();

        // Display game elements
        this.game.display();

        // Display game menus
        if (!this.game.initComplete) return;
        if (this.activeMenu) {
            let canDisplay = true;
            if (this.activeMenu.menu.animation && !this.activeMenu.menu.animation.endedAnimation) {
                const ret = this.activeMenu.menu.animation.apply(this.scene);
                if (this.activeMenu.changed) {
                    const otherMenu = this.menus.find(menu => menu.player == this.activeMenu.player);
                    if (!otherMenu.menu.animation) canDisplay = ret;  // it only doesn't draw if the other menu was already animated
                }
            } else if (this.activeMenu.menu.animation) {
                this.activeMenu.menu.animation = null;
                const otherMenu = this.menus.find(menu => menu.player != this.activeMenu.player);
                if (otherMenu.menu.animation) {
                    this.activeMenu.node = otherMenu.node;
                    this.activeMenu.menu = otherMenu.menu;
                    this.activeMenu.changed = true;
                    canDisplay = false;
                }
            }
            if (canDisplay) this.activeMenu.node.display();
        }
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
        this.menus.forEach((menu) => menu.menu.setButtonValue(buttonName, String(value)));
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
        this.activeMenu = {...this.menus.find(menu => menu.player == player)};
    }
}