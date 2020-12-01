/**
 * @class MySpriteSheet
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {String} texture - Spritesheet texture image path
 * @param {Number} sizeM - Number of columns of the spritesheet
 * @param {Number} sizeN - Number of rows of the spritesheet
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

    /**
     * @method activateShader
     * Activates the spritesheet shader calling 'setActivateShaderSimple'
     */
    activateShader() {
        this.scene.setActiveShaderSimple(this.spriteShader);
    }
    
    /**
     * @method activateCellMN
     * Activates a cell in position (m, n) in the spritesheet
     * @param {Number} m - column of the cell to be activated
     * @param {Number} n - row of the the cell to be activated
     * @param {Boolean} activateShader - if True shader is activated. False when called by MySpriteText as shader does not need to be initialized for every character.
     */
    activateCellMN(m, n, activateShader = true) {
        this.spriteShader.setUniformsValues({ currentM: m, currentN: n });
        if (activateShader) this.activateShader();
        this.scene.spritesheetAppearance.setTexture(this.spriteTexture);
        this.scene.spritesheetAppearance.apply();
    }

    /**
     * @method activateCellP
     * Activates the nth (represented by p) cell in the spritesheet.
     * Calculates value of m and n based on p, and calls activateCellMN().
     * @param {Number} p - position of the cell to be activated
     * @param {Boolean} activateShader - if True shader is activated. False when called by MySpriteText as shader does not need to be initialized for every character.
     */
    activateCellP(p, activateShader = true){
        let m = p % this.sizeM;
        let n = Math.floor(p/this.sizeM) % this.sizeN;
        this.activateCellMN(m, n, activateShader);
    }
}