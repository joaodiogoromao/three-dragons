class MyButton extends CGFobject {
    constructor(scene, action, gridPosition, text) {
        super(scene);

        this.action = action;
        this.gridPosition = gridPosition;
        this.text = text ? new MySpriteText(scene, text) : null;
        this.height = 2;

        this.front = new MyRectangle(scene, 0, 0, gridPosition.row.end, gridPosition.col.end);
        this.top = new MyRectangle(scene, 0, this.height, gridPosition.row.end, 0);
        this.bottom = new MyRectangle(scene, 0, 0, gridPosition.row.end, this.height);
        this.left = new MyRectangle(scene, 0, gridPosition.col.end, this.height, 0);
        this.right = new MyRectangle(scene, 0, 0, this.height, gridPosition.col.end);
        this.faces = [this.front, this.top, this.bottom, this.left, this.right];
    }

    display() {
        this.displayText();
        this.front.display();
        this.displayTopBottomFaces();
        this.displayLeftRightFaces();
    }

    displayText() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.text.display();
        this.scene.popMatrix();
    }

    displayTopBottomFaces() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.top.display();

        this.scene.translate(0, 0, this.gridPosition.col.end);
        this.bottom.display();
        this.scene.popMatrix();
    }

    displayLeftRightFaces() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.left.display();

        this.scene.translate(0, 0, this.gridPosition.row.end);
        this.right.display();
        this.scene.popMatrix();
    }
}