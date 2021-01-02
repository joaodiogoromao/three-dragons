
class MyBoard extends CGFobject {
    constructor(scene, whiteTileId, blackTileId, whiteDiceId, blackDiceId, nRows, nCols) {
        super(scene);

        this.possibleMoves = null;

        this.gameBoard = null;

        this.whiteTileId = whiteTileId;
        this.blackTileId = blackTileId;

        this.whiteDiceId = whiteDiceId;
        this.blackDiceId = blackDiceId;

        this.whiteTileObj = null;
        this.blackTileObj = null;

        this.whiteDiceObj = null;
        this.blackDiceObj = null;

        this.nRows = nRows;
        this.nCols = nCols;

        this.tiles = [];
        this.pieces = [];

        this.whiteRemovedCount = 0;
        this.blackRemovedCount = 0;

        this.possibleMovesShader = new CGFshader(scene.gl, "shaders/possibleMoves.vert", "shaders/possibleMoves.frag");
    }

    reset() {
        console.log("RESET BOARD");
        this.pieces.splice(0, this.pieces.length);
        this.createPieces().forEach((piece) => this.pieces.push(piece));
        this.whiteRemovedCount = 0;
        this.blackRemovedCount = 0;
    }

    getRemovedPiecePosition(color) {
        if (color == "white") {
            this.whiteRemovedCount++;
            return {
                x: -1 - ((this.whiteRemovedCount-1) % 2),
                z: 1 + Math.floor((this.whiteRemovedCount-1) / 2)
            }
        } else if (color == "black") {
            this.blackRemovedCount++;
            return {
                x: 11 + ((this.blackRemovedCount-1) % 2),
                z: 9 - Math.floor((this.blackRemovedCount-1) / 2)
            }
        }
    }

    setPossibleMoves(possibleMoves) {
        this.possibleMoves = possibleMoves;
    }

    setGameBoard(newGameBoard) {
        console.log("Updating game board with", newGameBoard);
        const piecesToRemove = this.updatePieces(newGameBoard);
        this.gameBoard = newGameBoard;
        return piecesToRemove;
    }

    updatePieces(newGameBoard) {
        console.log("old: ", this.gameBoard, " new: ", newGameBoard);
        const added = [], removed = [];
        const piecesToRemove = [];
        for (const i in this.gameBoard) {
            const prevLine = this.gameBoard[i];
            const currLine = newGameBoard[i];
            const z = parseInt(i)+1;
            for (const j in prevLine) {
                const prevEl = prevLine[j];
                const currEl = currLine[j];
                const x = parseInt(j)+1;

                // piece stayed in the same position
                if (JSON.stringify(prevEl) === JSON.stringify(currEl)) {
                    continue;
                }

                // piece has been changed 
                if (prevEl instanceof Array && prevEl.length == 3) { // piece moved from the current position
                    removed.push({ x: x, z: z, player: prevEl[1], value: prevEl[2] });
                } else if (prevEl instanceof Array && prevEl.length == 2) { // dragon was invoked
                    console.log("invoked", prevEl, currEl);
                    added.push({ x: x, z: z, player: currEl[1], value: currEl[2] });
                } else if (prevEl === "empty") { // piece moved to the the current position
                    added.push({ x: x, z: z, player: currEl[1], value: currEl[2] });
                }
            }
        }

        console.log("Piece diff", added, removed);

        for (const piece of this.pieces) {
            if (piece.removed) continue;

            const rem = removed.find((el) => 
                el.x == piece.position.x && el.z == piece.position.z 
                && el.player == piece.player);

            if (!rem) continue;

            const add = added.find(el => el.player == piece.player);

            if (!add) { // Remove piece
                piece.removed = true;
                piecesToRemove.push(piece);
            } else { // Move piece
                piece.position.x = add.x;
                piece.position.z = add.z;
                piece.value = add.value;
                added.splice(added.indexOf(add), 1);
            }
            removed.splice(removed.indexOf(rem), 1);
        }

        // invoke dragons
        for (const add of added) {
            this.pieces.push(this.createDice(add.player, add.value, { x: add.x, z: add.z }));
        }

        return piecesToRemove;
    }

    correspondIdsToObjects(objMap) {
        const ids = new Map([['whiteTile', this.whiteTileId], ['blackTile', this.blackTileId], ['whiteDice', this.whiteDiceId], ['blackDice', this.blackDiceId]]);
        for (const [key, id] of ids) {
            if (objMap[id] == undefined) {
                throw new Error(`The id '${id}' given to leaf 'board' has no match.`);
            }
            this[key+"Obj"] = objMap[id];
        }
        this.tiles = this.createTiles();
        this.pieces = this.createPieces();
    }

    copy(Obj) {
        return Object.assign(Object.create(Object.getPrototypeOf(Obj)), Obj);
    }

    createTiles() {
        let tiles = [];
        for (let row = 0; row < this.nRows; row++)
            for (let col = 0; col < this.nCols; col++) {
                if ((col + row) % 2 == 0)
                    tiles.push(this.copy(this.whiteTileObj));
                else
                    tiles.push(this.copy(this.blackTileObj));
            }
        return tiles;
    }

    createDice(color, value, position) {
        const dice = color == 'white' ? this.copy(this.whiteDiceObj) : this.copy(this.blackDiceObj);
        dice.value = value;
        dice.position = position;
        dice.player = color;
        return dice;
    }

    createPieces() {
        const pieces = [];
        pieces.push(this.createDice('black', 3, {x: 2, z: 1}));
        for (let i = 3; i <= 7; i++) {
            pieces.push(this.createDice('black', 2, {x: i, z: 1}));
        }
        pieces.push(this.createDice('black', 3, {x: 8, z: 1}));
        pieces.push(this.createDice('black', 4, {x: 5, z: 2}));


        pieces.push(this.createDice('white', 3, {x: 2, z: 9}));
        for (let i = 3; i <= 7; i++) {
            pieces.push(this.createDice('white', 2, {x: i, z: 9}));
        }
        pieces.push(this.createDice('white', 3, {x: 8, z: 9}));
        pieces.push(this.createDice('white', 4, {x: 5, z: 8}));
        return pieces;
    }

    showDiceFace(face) {
        switch(face) {
            case 2:
                this.scene.rotate(90*DEGREE_TO_RAD, 0, 0, 1);
                break;
            case 3:
                this.scene.rotate(90*DEGREE_TO_RAD, 1, 0, 0);
                break;
            case 4:
                this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);
                break;
            case 5:
                this.scene.rotate(-90*DEGREE_TO_RAD, 0, 0, 1);
                break;
            case 6:
            default:
                console.log("The dice number given is not needed.");
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.nRows / 2, 0, -this.nCols / 2);

        this.scene.pushMatrix();
        for (let row = 0; row < this.nRows; row++) {
            this.scene.pushMatrix();
            for (let col = 0; col < this.nCols; col++) {
                let currentTile = this.tiles[row * this.nCols + col];
                this.scene.registerForPick(row * this.nCols + col + 1, currentTile);

                if (this.possibleMoves != null && this.isValidMovePosition(row, col))
                    this.scene.setActiveShaderSimple(this.possibleMovesShader);

                currentTile.display();

                if (this.possibleMoves != null)
                    this.scene.setActiveShaderSimple(this.scene.defaultShader);

                this.scene.translate(1, 0, 0);
            }
            this.scene.popMatrix();
            this.scene.translate(0, 0, 1);
        }
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        let count = 1;
        for (const piece of this.pieces) {
            this.scene.registerForPick(81+count/*(piece.position.z-1)*this.nCols + piece.position.x /* - 1 + 1 */, piece);

            this.scene.pushMatrix();
            if (piece.animation && !piece.animation.finishedMovingState) {
                //console.log("Applying piece animation");
                piece.animation.apply(this.scene);
            }
            else if (piece.animation) {
                piece.animation.finishedMovingState = false;
                piece.animation = null;
            }
            this.scene.translate(piece.position.x-0.5, 0.36 /*need to change in order not to have this*/ , piece.position.z-0.5);
            this.showDiceFace(piece.value);

        
            piece.display();
            this.scene.popMatrix();

            count++;
        }
        this.scene.clearPickRegistration();

        this.scene.popMatrix();
    }

    isValidMovePosition(row, col) {
        if (this.possibleMoves == null) return false;

        const findMove = this.possibleMoves.find(move => {
            const final = move.final;
            return final.x == col+1 && final.z == row+1;
        });
        return findMove != null;
    }
}