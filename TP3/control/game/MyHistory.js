class MyHistory {
    constructor(history) {
        this.history = history ? history : [];
    }

    last() {
        if (!this.history.length) return undefined;
        return this.history[this.history.length - 1];
    }

    first() {
        if (!this.history.length) return undefined;
        return this.history[0];
    }

    popLast() {
        this.history.pop();
    }

    popFirst() {
        const res = this.history.splice(0, 1);
        return res.length ? res[0] : undefined;
    }

    push(move) {
        this.history.push(move);
    }
}