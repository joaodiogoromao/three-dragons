
class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.charWidth = 1;
        this.charHeight = 1;

        this.geometry = new MyRectangle(scene, 0, 0, this.charWidth, this.charHeight);
        this.spriteSheet = new MySpriteSheet(scene, './scenes/images/oolite-font.png', 16, 16);
    }

    getCharacterPosition(character) {
        return character.charCodeAt(0);
    }

    display() {
        // apply appearance
        this.scene.pushMatrix();
        this.scene.pushMaterial();

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
        
        this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.scene.popMaterial();
        this.scene.popMatrix();
    }
}


