

class MyGame {
    constructor(board, state) {
        this.board = board;
        this.setState(state);
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    update(timeSinceProgramStarted) {
        this.state.update(timeSinceProgramStarted);
    }

}

