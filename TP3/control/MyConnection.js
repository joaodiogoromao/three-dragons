/**
 * @class MyConnection
 * This manages all comunication with the prolog server
 */
class MyConnection {
    /**
     * @param {String} server server address
     */
    constructor(server) {
        this.server = server;

        // Certifies that the server is on
        this.sendRequest("handshake", function(res) {
            if (res == "handshake") return;
            throw new Error("Couldn't connect to server " + this.server);
        }, false);
    }

    /**
     * 
     * @param {String} params the url params
     * @param {Function} action function to be executed when the response is received
     * @param {Boolean} json Whether to parse the answer as json or not
     */
    sendRequest(params, action, json = true) {
        const reqHeaders = new Headers();
        reqHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const request = new Request(`${this.server}${params}`, {
            method: 'GET',
            headers: reqHeaders
        });

        fetch(request)
            .then(response => json ? response.json() : response.text())
            .then(result => {
                console.log("Response:", result);
                action(result);
            });
    }

    /**
     * Converts a game board to a string that can be passed as url argument
     * @param {Array[Array[]]} gameBoard the game board
     */
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

    /**
     * Converts a predicate to a string that can be passed as url argument
     * @param {Array[]} el predicate
     */
    predicateCompoundToUrlFormat(el) {
        const temp = [...el];
        const predicate = temp.splice(0, 1);
        return `${predicate}(${temp.join(",")})`;
    }

    /**
     * Converts the game state to a string that can be passed as url argument
     * @param {AObject} gameState game state
     */
    gameStateToUrlFomat(gameState) {
        return `[${gameState.player},[${gameState.npieces[0]},${gameState.npieces[1]}],${this.gameBoardToUrlFormat(gameState.gameBoard)}]`;
    }

    /**
     * Converts a move to a string that can be passed as url argument
     * @param {Object} move
     */
    moveToUrlFormat(move) {
        return `[${move.initial.x},${move.initial.z},${move.final.x},${move.final.z},${this.predicateCompoundToUrlFormat(move.piece)}]`;
    }
    
    init(action) {
        this.sendRequest('initial', action);
    }

    // moves/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]
    getPossibleMoves(gameState, action) {
        this.sendRequest(`moves/${this.gameStateToUrlFomat(gameState)}`, action);
    }

    // move/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]/[MoveX1, MoveY1, MoveX2, MoveY2, Piece]
    applyMove(gameState, move, action) {
        this.sendRequest(`move/${this.gameStateToUrlFomat(gameState)}/${this.moveToUrlFormat(move)}`, action);
    }

    // move/bot/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]/Level
    applyBotMove(gameState, level, action) {
        this.sendRequest(`move/bot/${this.gameStateToUrlFomat(gameState)}/${level}`, action);
    }
}

