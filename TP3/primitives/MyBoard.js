
class MyBoard extends CGFobject {
    constructor(scene, whiteTileId, blackTileId, whiteDiceId, blackDiceId, nRows, nCols) {
        super(scene);

        this.possibleMoves = null;

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

        this.possibleMovesShader = new CGFshader(scene.gl, "shaders/possibleMoves.vert", "shaders/possibleMoves.frag");
    }

    setPossibleMoves(possibleMoves) {
        this.possibleMoves = possibleMoves;
    }

    correspondIdsToObjects(objMap) {
        const ids = new Map([['whiteTile', this.whiteTileId], ['blackTile', this.blackTileId], ['whiteDice', this.whiteDiceId], ['blackDice', this.blackDiceId]]);
        for (let [key, id] of ids) {
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
        return dice;
    }

    createPieces() {
        let pieces = [];
        pieces.push(this.createDice('white', 3, {x: 2, z: 1}));
        for (let i = 3; i <= 7; i++) {
            pieces.push(this.createDice('white', 2, {x: i, z: 1}));
        }
        pieces.push(this.createDice('white', 3, {x: 8, z: 1}));
        pieces.push(this.createDice('white', 4, {x: 5, z: 2}));


        pieces.push(this.createDice('black', 3, {x: 2, z: 9}));
        for (let i = 3; i <= 7; i++) {
            pieces.push(this.createDice('black', 2, {x: i, z: 9}));
        }
        pieces.push(this.createDice('black', 3, {x: 8, z: 9}));
        pieces.push(this.createDice('black', 4, {x: 5, z: 8}));
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
            if (piece.animation != null && !piece.animation.endedAnimation) piece.animation.apply(this.scene);
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
            const final = MyGame.prologCoordsToJSCoords(move.final);
            return final.x == col+1 && final.z == row+1;
        });
        return findMove != null;
    }
}