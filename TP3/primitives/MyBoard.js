


class MyBoard extends CGFobject {
    constructor(scene, whiteTile, blackTile, nRows, nCols) {
        super(scene);
        this.whiteTileId = whiteTile;
        this.blackTileId = blackTile;
        this.whiteTileObj = null;
        this.blackTileObj = null;
        this.nRows = nRows;
        this.nCols = nCols;
    }

    correspondIdsToObjects(objMap) {
        this.whiteTileObj = objMap[this.whiteTileId];
        this.blackTileObj = objMap[this.blackTileId];
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.nRows/2, 0, -this.nCols/2);
        for (let row = 0; row < this.nRows; row++) {
            this.scene.pushMatrix();
            for (let col = 0; col < this.nCols; col++) {
                if ((col+row) % 2 == 0)
                    this.whiteTileObj.display();
                else
                    this.blackTileObj.display();

                this.scene.translate(1, 0, 0);
            }
            this.scene.popMatrix();
            this.scene.translate(0, 0, 1);
        }
        this.scene.popMatrix();
    }
}