

class MyGame {
    constructor(board, scene) {
        this.board = board;
        this.connection = new MyConnection('http://localhost:8081/');
        const onInitComplete = function () {
            this.setState(new MyStateWaiting(scene, this));
        }.bind(this);
        this.connection.init(function(res) {
            this.prologGameState = res;
            this.initComplete = true;
            this.stopWaitingForStateUpdate();
            onInitComplete();
        }.bind(this));
        this.initComplete = false;
        this.makeWaitingForStateUpdate();
    }

    static prologCoordsToJSCoords(position) {
        const x = position.x;
        const y = position.y;
        return {
            x: x,
            z: 10-y
        }
    }

    makeWaitingForStateUpdate() {
        if (this.stateUpToDate === false) console.error("Trying to make game wait for state update, but already waiting.");
        this.stateUpToDate = false;
    }

    stopWaitingForStateUpdate() {
        if (this.stateUpToDate === true) console.error("Trying to make game stop waiting for state update, but wasn't waiting.");
        this.stateUpToDate = true;
    }

    setState(state) {
        if (!(state instanceof MyState)) throw new Error("The state of the game may only be an extension of MyGameState.");
        this.state = state;
    }

    update(timeSinceProgramStarted) {
        if (!this.initComplete) return;
        if (!(this.state instanceof MyStateMoving) && !this.stateUpToDate) return; 
        this.state.update(timeSinceProgramStarted);
    }

}

