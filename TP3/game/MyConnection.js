class MyConnection {
    constructor(server) {
        this.server = server;
    }

    sendRequest(params, action) {
        const request = new Request(this.server + params, {
            method: 'GET'
        });

        fetch(request)
            .then(response => response.json())
            .then(result => {
                console.log("Response:", result);
                action(result);
            });
    }

    gameStateToUrlFomat(gameState) {
        return `[${gameState.player}, [${gameState.npieces[0]}, ${gameState.npieces[1]}], ${gameState.gameboard}]`;
    }
    moveToUrlFormat(move) {
        return `[${move.join(', ')}]`;
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
        this.sendRequest(`move/[${this.gameStateToUrlFomat(gameState)}/[${this.moveToUrlFormat(move)}]`, action);
    }
}

