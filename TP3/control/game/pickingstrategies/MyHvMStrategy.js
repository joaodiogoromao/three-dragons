/**
 * @class MyHvMStrategy
 * Implements the strategy for the Human vs Machine game mode.
 */
class MyHvMStrategy extends MyStrategy {
    /**
     * @param {CGFscene} scene the scene object
     * @param {*} humanPiece the human color
     */
    constructor(scene, humanPiece) {
        super(scene);
        this.setPlayerColor(humanPiece);
    }


    /**
     * Applies the strategy to the current game, by calling the super 'apply' method
     * @param {Function} extender optional function that is executed in the end
     */
    apply(extender) {
        const fn = function() {
            if (this.game.movie)
                this.game.setState(new MyStateMoviePlay(this.scene, this.game));
            else {
                if (this.game.prologGameState.player == this.humanPiece) { // the next player is the human
                    this.game.setState(new MyStateWaiting(this.scene, this.game));
                } else { // the next player is the machine
                    this.game.setState(new MyStateMachine(this.scene, this.game, this.difficulty));
                }
            }
        }.bind(this);
        super.apply(fn, extender);
    }
    
    /**
     * SET method for difficulty
     * @param {String} difficulty 
     */
    setMachineDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    /**
     * SET method for player color
     * @param {String} humanPiece 
     */
    setPlayerColor(humanPiece) {
        if (humanPiece != "white" && humanPiece != "black" && humanPiece != null) {
            throw new Error("Invalid human player's piece given to MyHvMStrategy.");
        }
        this.humanPiece = humanPiece;
    }
}