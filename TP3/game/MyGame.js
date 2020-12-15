

class MyGame {
    constructor(board, scene) {
        this.board = board;
        this.setState(new MyStateWaiting(scene, this));
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    update(timeSinceProgramStarted) {
        this.state.update(timeSinceProgramStarted);
    }

}

