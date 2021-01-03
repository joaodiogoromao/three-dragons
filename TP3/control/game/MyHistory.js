/**
 * @class MyHistory
 * Saves the history of game states
 */
class MyHistory {
    /** 
     * @param {Array[Object]} history a preexisting history
     */
    constructor(history) {
        this.history = history ? history : [];
    }

    /**
     * GET method for last element
     */
    last() {
        if (!this.history.length) return undefined;
        return this.history[this.history.length - 1];
    }

    /**
     * GET method for first element
     */
    first() {
        if (!this.history.length) return undefined;
        return this.history[0];
    }

    /**
     * POP method for last element
     */
    popLast() {
        this.history.pop();
    }

    /**
     * POP method for last element
     */
    popFirst() {
        const res = this.history.splice(0, 1);
        return res.length ? res[0] : undefined;
    }

    /**
     * PUSH
     * @param {Object} move the most recent prologGameState
     */
    push(move) {
        this.history.push(move);
    }
}