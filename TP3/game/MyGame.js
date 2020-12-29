

class MyGame {
    constructor(board, scene) {
        this.board = board;
        this.nextMoveStrategy = new MyMvMStrategy(this, scene);
        this.connection = new MyConnection('http://localhost:8081/');
        this.connection.init(function(res) {
            this.prologGameState = res;
            this.initComplete = true;
            this.stopWaitingForStateUpdate();
            this.nextMoveStrategy.apply();
        }.bind(this));
        this.initComplete = false;
        this.makeWaitingForStateUpdate();
    }

    makeWaitingForStateUpdate() {
        if (this.stateUpToDate === false) throw new Error("Trying to make game wait for state update, but already waiting.");
        this.stateUpToDate = false;
    }

    stopWaitingForStateUpdate() {
        if (this.stateUpToDate === true) throw new Error("Trying to make game stop waiting for state update, but wasn't waiting.");
        this.stateUpToDate = true;
        if (this.onStateUpToDate) {
            this.onStateUpToDate();
            this.unsetOnStateUpToDate();
        }
    }

    setOnStateUpToDate(fn) {
        if (this.onStateUpToDate) throw new Error("Trying to set game onStateUpToDate, but already set."); 
        this.onStateUpToDate = fn;
    }

    unsetOnStateUpToDate() {
        if (this.onStateUpToDate == undefined) throw new Error("Trying to unset game onStateUpToDate, but not set."); 
        this.onStateUpToDate = undefined;
    }

    updateBoard() {
        if (this.stateUpToDate) {
            this.board.setGameBoard(this.prologGameState.gameBoard);
        } else {
            this.setOnStateUpToDate(function() {
                this.board.setGameBoard(this.prologGameState.gameBoard);
            }.bind(this));
        }
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    update(timeSinceProgramStarted) {
        if (!this.initComplete) return;
        if (!(this.state instanceof MyStateMoving) && !this.stateUpToDate) return;  // if the state is not an animation, all server requests must have been fulfilled 
        this.state.update(timeSinceProgramStarted);
        if (!(this.state instanceof MyStateMoving)) {
            if (this.prologGameState.gameOver) this.setState(new MyStateGameOver(this.scene, this));
        }
    }

}

