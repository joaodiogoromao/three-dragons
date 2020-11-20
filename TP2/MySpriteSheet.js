/**
 * @class MySpriteSheet
 */
class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.size = sizeM*sizeN;
        
        this.spriteShader = new CGFshader(scene.gl, "shaders/sprite.vert", "shaders/sprite.frag");
        this.spriteShader.setUniformsValues({ sizeM: sizeM, sizeN: sizeN });
        this.spriteTexture = new CGFtexture(scene, texture);
    }

    activateShader() {
        this.scene.setActiveShaderSimple(this.spriteShader);
    }
    
    activateCellMN(m, n, activateShader = true) {
        this.spriteShader.setUniformsValues({ currentM: m, currentN: n });
        if (activateShader) this.activateShader();
        this.scene.spritesheetAppearance.setTexture(this.spriteTexture);
        this.scene.spritesheetAppearance.apply();
    }

    activateCellP(p, activateShader = true){
        let m = p % this.sizeM;
        let n = Math.floor(p/this.sizeN) % this.sizeN;
        this.activateCellMN(m, n, activateShader);
    }
}