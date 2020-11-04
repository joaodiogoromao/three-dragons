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
        
        this.spriteShader = new CGFshader(this.gl, "shaders/sprite.vert", "shaders/sprite.frag");
        this.spriteShader.setUniformsValues({ sizeM: sizeM, sizeN: sizeN });
        this.spriteTexture = new CGFtexture(scene, texture);
    }
    
    activateCellMN(m, n) {
        this.spriteShader.setUniformsValues({ viewingM: m, viewingN: n });
        this.scene.setActiveShader(this.spriteShader);
        this.scene.spritesheetAppearance.setTexture(this.spriteTexture);
        this.scene.spritesheetAppearance.apply();

    }

    activateCellP(p){
        let m = p % this.m;
        let n = math.floor(p/this.size * this.n);
        this.activateCellMN(m, n);
    }
}