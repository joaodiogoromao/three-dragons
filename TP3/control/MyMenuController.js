/**
 * @class MyMenuController
 * Controls the menus actions
 */
class MyMenuController {

    constructor(scene, state) {
        this.scene = scene;
        this.state = state;

        this.actionGenerator = {
            "easy": this.setEasyDifficulty.bind(this),
            "medium": this.setMediumDifficulty.bind(this),
            "hard": this.setHardDifficulty.bind(this),
            "hvh": this.setHvHMode.bind(this),
            "hvm": this.setHvMMode.bind(this),
            "mvm": this.setMvMMode.bind(this),
            "exit": this.exitGame.bind(this),
            "movie": this.seeGameMovie.bind(this),
            "back": this.goBack.bind(this),
            "white": this.selectWhitePieces.bind(this),
            "black": this.selectBlackPieces.bind(this),
            "nothing": this.doNothing,
            "theme1": (() => this.setTheme(0)).bind(this),
            "theme2": (() => this.setTheme(1)).bind(this),
            "theme3": (() => this.setTheme(2)).bind(this)
        }

        this.themeButtonsIds = [9, 10, 11];
    }

    /**
     * Selects a button in the menu
     * @param {String} nodeName 
     * @param {String} leafNodeName 
     * @param {MyButton} selectedButton 
     */

    select(nodeName, leafNodeName, selectedButton) {
        const menuNode = this.scene.menus.nodes[nodeName];
        const menu = menuNode.getLeafNode(leafNodeName).obj;

        for (let button of menu.buttons) {
            if (selectedButton.name === button.name) button.select();
            else button.unselect();
        }
    }
    /**
     * Checks the pick results and executes the picked action
     * @param {Boolean} deleteAll whether to delete all pick results
     */
    update(deleteAll = true) {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                const deleteResults = [];
                for (let i = 0; i < this.scene.pickResults.length; i++) {
                    const obj = this.scene.pickResults[i][0];
                    const id = this.scene.pickResults[i][1];

                    if (this.themeButtonsIds.includes(id)) {
                        this.select("whitesMenu", "whites", obj);
                        this.select("blacksMenu", "blacks", obj);
                    }
                    if (id && obj.action && this.actionGenerator[obj.action]) {
                        this.actionGenerator[obj.action](this.state);
                        deleteResults.push(id);
                    }
                }
                if (deleteAll) this.scene.discardPickResults();
                else {
                    deleteResults.forEach((res) => this.scene.pickResults.splice(res, 1));
                }
            }
        }
    }


    /**
     * THE FOLLOWING ARE ACTION FUNCTIONS; THAT EXECUTE A GIVEN MENU ACTION
     */

    doNothing(){}

    setTheme(sceneGraphIndex) {
        this.scene.resetSceneGraph();
        this.scene.initSceneGraph(sceneGraphIndex);
        this.state.setSceneGraphIndex(sceneGraphIndex);
    }

    selectWhitePieces() {
        if (typeof this.state.setPlayerColor == 'function')
            this.state.setPlayerColor("white");
    }

    selectBlackPieces() {
        if (typeof this.state.setPlayerColor == 'function')
            this.state.setPlayerColor("black");
    }
    
    setEasyDifficulty() {
        if (typeof this.state.advance == 'function') this.state.advance("easy");
    }
    
    setMediumDifficulty() {
        if (typeof this.state.advance == 'function') this.state.advance("medium");
    }
    
    setHardDifficulty() {
        if (typeof this.state.advance == 'function') this.state.advance("hard");
    }
    
    setHvHMode() {
        if (typeof this.state.advance == 'function' && typeof this.state.setGameStrategy == 'function') {
            this.state.setGameStrategy(new MyHvHStrategy(this.state.scene));
            this.state.advance();
        }
    }
    
    setHvMMode() {
        // set difficulty menu display flag to true
        if (typeof this.state.setGameStrategy == 'function') {
            this.state.setGameStrategy(new MyHvMStrategy(this.state.scene, "white"));
        }
    }
    
    setMvMMode() {
        // set difficulty menu display flag to true
        if (typeof this.state.setGameStrategy == 'function') {
            this.state.setGameStrategy(new MyMvMStrategy(this.state.scene));
        }
    }
    
    exitGame() {
        this.state.gameOrchestrator.exit();
    }
    
    seeGameMovie() {
        this.state.seeGameMovie();
    }
    
    goBack() {
        if (typeof this.state.goBack == 'function') this.state.goBack();
    }
}

