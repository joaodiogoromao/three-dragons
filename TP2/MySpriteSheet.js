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
    
    activateCellMN(m, n) {
        this.spriteShader.setUniformsValues({ currentM: m, currentN: n });
        this.scene.setActiveShader(this.spriteShader);
        this.scene.spritesheetAppearance.setTexture(this.spriteTexture);
        this.scene.spritesheetAppearance.apply();
    }

    activateCellP(p){
        let m = p % this.sizeM;
        let n = Math.floor(p/this.sizeN) % this.sizeN;
        this.activateCellMN(m, n);
    }
}