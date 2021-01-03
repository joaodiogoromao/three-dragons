/**
 * @class MySpriteText
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {String} text - text string to be visualized
 */
class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.charWidth = 1;
        this.charHeight = 1;

        this.geometry = new MyRectangle(scene, 0, 0, this.charWidth, this.charHeight);

        this.spriteSheet = new MySpriteSheet(scene, './scenes/images/oolite-font-black.png', 16, 16);
    }

    /**
     * Gets the unicode of the character given as parameter, corresponding to position in spritesheet
     * @param {String} character 
     */
    getCharacterPosition(character) {
        return character.charCodeAt(0);   // ascii code
    }

    /**
     * @method getWidth
     * Gets the total width of the text
     */
    getWidth() {
        return this.charWidth * this.text.length;
    }

    /**
     * @method getHeight
     * Gets the total height of the text
     */
    getHeight() {
        return this.charHeight;
    }

    /**
     * @method display
     * Displays the text spritesheet.
     * Activates the shader.
     * For each character present on the text to be visualized calls activateCellP(p, false), p being the ascii code of the character, 
     * and translates the next scene object with 1 unit to the right.
     */
    display() {
        // apply appearance
        this.scene.pushMatrix();
        this.scene.pushMaterial();

        this.scene.translate(-(this.text.length/2.), -0.5, 0);

        this.spriteSheet.activateShader();
        
        for (const i in this.text) {
            const char = this.text[i];
            let cellPos;
            if ((cellPos = this.getCharacterPosition(char)) == null) {
                console.error("Invalid character in string sent to MySpriteText!");
                continue;
            }
            this.spriteSheet.activateCellP(cellPos, false);

            this.scene.translate((i == 0 ? 0 : 1)*this.charWidth, 0, 0); 
            this.geometry.display();

        }
        
        this.scene.setActiveShaderSimple(this.scene.defaultShader); //resets the default shader

        this.scene.popMaterial();
        this.scene.popMatrix();
    }
}


