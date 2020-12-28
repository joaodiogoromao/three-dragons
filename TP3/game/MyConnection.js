class MyConnection {
    constructor(server) {
        this.server = server;
    }

    sendRequest(params, action) {
        const reqHeaders = new Headers();
        reqHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const request = new Request(`${this.server}${params}`, {
            method: 'GET',
            headers: reqHeaders
        });

        fetch(request)
            .then(response => response.json())
            .then(result => {
                console.log("Response:", result);
                action(result);
            });
    }

    gameBoardToUrlFormat(gameBoard) {
        let res = "[";

        for (const i in gameBoard) {
            const subList = gameBoard[i];
            res += "[";
            for (const j in subList) {
                const el = subList[j];
                if (el instanceof Array) {
                    res += this.predicateCompoundToUrlFormat(el);
                } else {
                    res += el;
                }
                if (j != subList.length -1) res += ",";
            }
            res += "]"
            if (i != gameBoard.length -1) res += ",";
        }
        res += "]";
        return res;
    }

    predicateCompoundToUrlFormat(el) {
        const temp = [...el];
        const predicate = temp.splice(0, 1);
        return `${predicate}(${temp.join(",")})`;
    }

    gameStateToUrlFomat(gameState) {
        return `[${gameState.player},[${gameState.npieces[0]},${gameState.npieces[1]}],${this.gameBoardToUrlFormat(gameState.gameboard)}]`;
    }

    moveToUrlFormat(move) {
        return `[${move.initial.x},${move.initial.y},${move.final.x},${move.final.y},${this.predicateCompoundToUrlFormat(move.piece)}]`;
    }
    
    init(action) {
        this.sendRequest(`initial`, action);
    }

    // moves/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]
    getPossibleMoves(gameState, action) {
        this.sendRequest(`moves/${this.gameStateToUrlFomat(gameState)}`, action);
    }

    // move/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]/[MoveX1, MoveY1, MoveX2, MoveY2, Piece]
    applyMove(gameState, move, action) {
        this.sendRequest(`move/${this.gameStateToUrlFomat(gameState)}/${this.moveToUrlFormat(move)}`, action);
    }
}

