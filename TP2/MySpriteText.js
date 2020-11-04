
class MySpriteText {
    MySpriteText(scene, text) {
        this.scene = scene;
        this.text = text;

        const charWidth = 1;
        const charHeight = 2;

        this.geometry = new MyRectangle(scene, 0, 0, charWidth, charHeight);
        this.spriteSheet = new MySpriteSheet();
    }

    getCharacterPosition(character) {
        return null;
    }

    display() {
        // apply appearance
        this.scene.pushMatrix();
        for (const i in text) {
            const char = text[i];
            let cellPos;
            if ((cellPos = this.getCharacterPosition(char)) == null) {
                console.error("Invalid character in string sent to MySpriteText!");
                continue;
            }
            this.spriteSheet.activateCellMN(cellPos.m, cellPos.n);

            this.scene.translate((i == 0 ? 0 : 1)*charWidth, 0, 0);
            this.geometry.display();

        }
        this.scene.popMatrix();
    }
}


