

class MyGame {
    constructor(board, scene) {
        this.board = board;
        this.connection = new MyConnection('http://localhost:8081/');
        this.connection.init(function(res) {
            this.initComplete = true;
            this.prologGameState = res;
        }.bind(this));
        this.setState(new MyStateWaiting(scene, this));
        this.initComplete = false;
        
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    update(timeSinceProgramStarted) {
        if (!this.initComplete) return;
        this.state.update(timeSinceProgramStarted);
    }

}

