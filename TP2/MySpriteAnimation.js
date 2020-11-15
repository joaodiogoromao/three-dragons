class MySpriteAnimation {
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        this.frameAmount = (endCell - startCell) + 1;
        this.timePerFrame = duration / this.frameAmount;
        this.frameIndex = startCell;

        this.charWidth = 1;
        this.charHeight = 1;

        this.geometry = new MyRectangle(scene, 0, 0, this.charWidth, this.charHeight);        
    }

    update(currentTime) {
        const time = currentTime;
        const timeInAnimation = time % this.duration;
        this.frameIndex = Math.floor(timeInAnimation / this.timePerFrame) + this.startCell;
        /*if (this.frameIndex > this.endCell){
            this.frameIndex = this.startCell;
        }*/
        //console.log(time, timeInAnimation, this.frameIndex);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.pushMaterial();

        this.spriteSheet.activateCellP(this.frameIndex);
        this.geometry.display();

        this.scene.popMaterial();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}