/**
 * Barrel primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {Number} base - the radius of both bases of the barrel
 * @param {Number} middle - the middle radius of the barrel
 * @param {Number} height - height of the barrel
 * @param {Number} slices - parts per section
 * @param {Number} stacks - sections along height
 */
class MyDefBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    /**
     * @method createControlPoints
     * Creates an array of control points corresponding to one half of the barrel.
     * @param {Number} surfaceNumber If == 1 function returns control points for the upper patch of the barrel;
     * If == -1 function returns control points for the lower patch of the barrel.
     */
    createControlPoints(surfaceNumber) {
        const H = (4/3)*(this.middle-this.base);
        let h = (4/3)*this.base;
        //let alpha = 30*Math.PI/180;
        //if (H < 0 && this.height > 0) alpha *= -1;
        
        const ret = [];
        let baseH = this.base + H;
        let base = this.base;
        let hH = null;
        for (let i = 0; i < 4; i++){
            if (i > 1 && baseH > 0 && this.base > 0) {
                baseH *= -1;
                base *= -1;
            }
            if (i == 0 || i == 3){
                h = 0;
                hH = 0;
            }else{
                h = (4/3)*this.base;
                hH = h + H;
            }
            ret.push([base * surfaceNumber, h * surfaceNumber, 0]);
            ret.push([baseH * surfaceNumber, hH * surfaceNumber, /*H/Math.tan(alpha)*/ this.height / 3]);   // not using the default angle because the barrel wouldn't look like a barrel for some values
            ret.push([baseH * surfaceNumber, hH * surfaceNumber, /*this.height - (H/Math.tan(alpha))*/ 2 * this.height / 3]);
            ret.push([base * surfaceNumber, h * surfaceNumber, this.height]);
        }
        return ret;
    }

    /**
     * @method intitBuffers
     * Creates the two MyPatch objects that constitute the MyDefBarrel object.
     */
	initBuffers() {
        this.surface1 = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints(-1));
        this.surface2 = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints(1));
	}

    /**
     * @method display
     * Displays the two MyPatch objects that constitute the MyDefBarrel object.
     */
	display() {
        this.surface1.display();
        this.surface2.display();
	}
}