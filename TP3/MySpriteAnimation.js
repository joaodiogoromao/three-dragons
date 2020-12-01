/**
 * @class MySpriteAnimation
 * Implements a sprite animation
 */
class MySpriteAnimation {
    /**
     * @constructor
     * @param {CGFscene} scene the scene object
     * @param {MySpriteSheet} spriteSheet the spritesheet object
     * @param {Number} duration the duration of the animation
     * @param {Number} startCell the sprite cell at which the animation starts
     * @param {Number} endCell the sprite cell at with the animation ends
     */
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        this.frameAmount = (endCell - startCell) + 1;
        this.timePerFrame = duration / this.frameAmount;
        this.frameIndex = startCell;

        this.geometry = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);        
    }
    
    /**
     * @method update
     * Updates the current frame
     * @param {Number} currentTime time since the program started
     */
    update(currentTime) {
        const timeInAnimation = currentTime % this.duration;
        this.frameIndex = Math.floor(timeInAnimation / this.timePerFrame) + this.startCell; // calculates the current frame
    }

    /**
     * @method display
     * Displays the spritesheet animation 
     */
    display() {
        this.scene.pushMatrix();
        this.scene.pushMaterial();

        this.spriteSheet.activateCellP(this.frameIndex); // activates the animation frame
        this.geometry.display();  // displays the spritesheet

        this.scene.popMaterial();
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.scene.defaultShader); // resets the default shader
    }
}