class MyHvMStrategy extends MyStrategy {
    constructor(scene, humanPiece) {
        super(scene);
        this.setPlayerColor(humanPiece);
    }

    apply(extender) {
        const fn = function() {
            if (this.game.prologGameState.player == this.humanPiece) {
                this.game.setState(new MyStateWaiting(this.scene, this.game));
            } else {
                this.game.setState(new MyStateMachine(this.scene, this.game, this.difficulty));
            }
        }.bind(this);
        super.apply(fn, extender);
    }

    setMachineDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    setPlayerColor(humanPiece) {
        if (humanPiece != "white" && humanPiece != "black") {
            throw new Error("Invalid human player's piece given to MyHvMStrategy.");
        }
        this.humanPiece = humanPiece;
    }
}