class MyStateGameOver extends MyState {
    constructor(scene, game) {
        super(scene, game);
    }

    update() {
        console.log("Game Over, winner: " + this.game.prologGameState.gameOver);
    }
}