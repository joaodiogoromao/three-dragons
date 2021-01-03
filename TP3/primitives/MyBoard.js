
class MyBoard extends CGFobject {
    constructor(scene, whiteTileId, blackTileId, whiteDiceId, blackDiceId, nRows, nCols, dragonAltarStepsId, dragonAltarShardId, dragonAltarAppearAnimId, mountainId) {
        super(scene);

        this.possibleMoves = null;

        this.gameBoard = null;

        this.whiteTileId = whiteTileId;
        this.blackTileId = blackTileId;

        this.whiteDiceId = whiteDiceId;
        this.blackDiceId = blackDiceId;

        this.dragonAltarStepsId = dragonAltarStepsId;
        this.dragonAltarShardId = dragonAltarShardId;

        this.dragonAltarAppearAnimId = dragonAltarAppearAnimId;

        this.mountainId = mountainId;

        this.whiteTileObj = null;
        this.blackTileObj = null;

        this.whiteDiceObj = null;
        this.blackDiceObj = null;

        this.dragonAltarStepsObj = null;
        this.dragonAltarShardObj = null;

        this.mountainObj = null;

        this.nRows = nRows;
        this.nCols = nCols;

        this.tiles = [];
        this.pieces = [];

        this.whiteRemovedCount = 0;
        this.blackRemovedCount = 0;

        this.dragonCavePositions = [
            { x: 1, z: 5 },
            { x: 5, z: 5 },
            { x: 9, z: 5 }
        ];

        this.mountainPositions = [
            { x: 1, z: 1 },
            { x: 1, z: 9 },
            { x: 9, z: 1 },
            { x: 9, z: 9 },
        ];

        this.possibleMovesShader = new CGFshader(scene.gl, "shaders/possibleMoves.vert", "shaders/possibleMoves.frag");
    }

    reset() {
        console.log("RESET BOARD");
        this.pieces.splice(0, this.pieces.length);
        this.createPieces().forEach((piece) => this.pieces.push(piece));
        this.dragonCavePositions.forEach((dragonCave) => { dragonCave.invoked = null; dragonCave.animation = null });
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

    setGameBoard(newGameBoard, undo = false) {
        console.log("Updating game board with", newGameBoard);
        const res = this.updatePieces(newGameBoard, undo);
        this.gameBoard = newGameBoard;
        return res;
    }

    getPiecesDiff(newGameBoard) {
        const added = [], removed = [];

        for (const i in this.gameBoard) {
            const prevLine = this.gameBoard[i];
            const currLine = newGameBoard[i];
            const z = parseInt(i)+1;
            for (const j in prevLine) {
                const prevEl = prevLine[j];
                const currEl = currLine[j];
                const x = parseInt(j)+1;

                // piece stayed in the same position
                if (JSON.stringify(prevEl) === JSON.stringify(currEl)) continue;

                // piece has been changed 
                if (prevEl instanceof Array && prevEl.length == 3) { // piece moved from the current position
                    removed.push({ x: x, z: z, player: prevEl[1], value: prevEl[2] });
                } else if (prevEl instanceof Array && prevEl.length == 2) { // dragon was invoked
                    added.push({ x: x, z: z, player: currEl[1], value: currEl[2] });
                } else if (prevEl === "empty") { // piece moved to the the current position
                    added.push({ x: x, z: z, player: currEl[1], value: currEl[2] });
                }
            }
        }

        return [ added, removed ];
    }

    getMove(newGameBoard) {
        const [added, removed] = this.getPiecesDiff(newGameBoard);

        for (const piece of this.pieces) {
            if (piece.removed) continue;

            const rem = removed.find((el) => 
                el.x == piece.position.x && el.z == piece.position.z 
                && el.player == piece.player && el.value == piece.value);

            if (!rem) continue;

            const add = added.find(el => el.player == piece.player && !this.isDragonCavePosition(el));

            if (add) return {startPos: piece.position, endPos: {x: add.x, z: add.z}, piece: piece};
        }
    }

    updatePieces(newGameBoard, undo = false) {
        const res = {
            removedPieces: [],
            movedPieces: [],
            addedPieces: []
        };

        const [ added, removed ] = this.getPiecesDiff(newGameBoard);

        console.log("Added, removed: ", added, removed);

        for (const piece of this.pieces) {
            if (piece.removed) continue;

            const rem = removed.find((el) => 
                el.x == piece.position.x && el.z == piece.position.z 
                && el.player == piece.player && el.value == piece.value);

            if (!rem) continue;

            const add = added.find(el => el.player == piece.player && !this.isDragonCavePosition(el));

            if (!add) { // Remove piece
                piece.removed = true;
                res.removedPieces.push(piece); // if undo, the dragon is reversed. If not undo, the piece is removed to the auxiliary board
            } else { // Move piece
                if (undo) { // the piece is unmoved
                    add.piece = piece;
                    res.movedPieces.push(add);
                } else {
                    piece.position.x = add.x;
                    piece.position.z = add.z;
                    piece.value = add.value;
                }
                added.splice(added.indexOf(add), 1);
            }
            removed.splice(removed.indexOf(rem), 1);
        }

        for (const add of added) {
            if (undo) res.addedPieces.push(add);  // the piece had been removed (move it from the auxiliary board to the game)
            else { // invokes dragon
                const dragon = this.createDice(add.player, add.value, { x: add.x, z: add.z });
                this.pieces.push(dragon);
                res.addedPieces.push(dragon);
            }
        }

        return res;
    }

    correspondIdsToObjects(objMap, animMap) {
        const ids = new Map([['whiteTile', this.whiteTileId], 
            ['blackTile', this.blackTileId], 
            ['whiteDice', this.whiteDiceId], 
            ['blackDice', this.blackDiceId], 
            ['dragonAltarSteps', this.dragonAltarStepsId], 
            ['dragonAltarShard', this.dragonAltarShardId],
            ['mountain', this.mountainId]]);
        
        for (const [key, id] of ids) {
            if (objMap[id] == undefined) {
                //throw new Error(`The id '${id}' given to leaf 'board' has no match.`);
            }
            this[key+"Obj"] = objMap[id];
        }
        this.tiles = this.createTiles();
        this.pieces = this.createPieces();

        console.log("SCENE:", this.scene);
        this.appearAnimation = animMap[this.dragonAltarAppearAnimId];
        this.disappearAnimation = this.appearAnimation.reverse();
        console.log("ANIMATIONS: ", this.appearAnimation, this.disappearAnimation);
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
                break;a
            case 5:
                this.scene.rotate(-90*DEGREE_TO_RAD, 0, 0, 1);
                break;
            case 6:
            default:
                console.log("The dice number given is not needed.");
        }
    }

    translateToBoardPosition(position) {
        this.scene.translate(position.x-0.5, 0.36 , position.z-0.5);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.nRows / 2, 0, -this.nCols / 2);

        this.scene.pushMatrix();
        for (let row = 0; row < this.nRows; row++) {
            this.scene.pushMatrix();
            for (let col = 0; col < this.nCols; col++) {
                const currentTile = this.tiles[row * this.nCols + col];
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

            if (this.isDragonCavePosition(piece.position)) this.scene.translate(0, 0.4, 0);
            this.translateToBoardPosition(piece.position);
            
            
            if (piece.animation && !piece.animation.finishedMovingState) {
                //console.log("Applying piece animation");
                if (!piece.animation.apply(this.scene) && !(piece.animation instanceof MyCurveAnimation)) {
                    this.scene.popMatrix();
                    continue;
                }
            } else if (piece.animation) {
                piece.animation.finishedMovingState = false;
                piece.animation = null;
            }

            this.showDiceFace(piece.value);

            piece.display();

            this.scene.popMatrix();

            count++;
        }
        this.scene.clearPickRegistration();

        for (const dragonCavePosition of this.dragonCavePositions) {
            this.scene.pushMatrix();

            this.translateToBoardPosition(dragonCavePosition);

            this.dragonAltarStepsObj.display();
            if (!dragonCavePosition.invoked) {
                if (dragonCavePosition.animation) dragonCavePosition.animation.apply(this.scene);
                if (dragonCavePosition.x == 5) this.scene.scale(1.5, 1.5, 1.5);
                this.dragonAltarShardObj.display();
            }

            this.scene.popMatrix();
        }

        for (const mountainPosition of this.mountainPositions) {
            this.scene.pushMatrix();
            this.translateToBoardPosition(mountainPosition);
            this.mountainObj.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    isDragonCavePosition(position) {
        return this.dragonCavePositions.find((pos) => pos.x == position.x && pos.z == position.z);
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