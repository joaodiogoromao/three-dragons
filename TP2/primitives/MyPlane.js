/**
 * Plane primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {Number} npartsU - number of divisions on U direction
 * @param {Number} npartsV - number of divisions on V direction
 */
class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.xPatchLength = 1.0 / npartsU;
        this.yPatchLength = 1.0 / npartsV;

        this.makeSurface([
                            [
                                [ 0.5, 0.0, -0.5, 1 ],
                                [ 0.5, 0.0,  0.5, 1 ]], 
                            [
								[-0.5, 0.0, -0.5, 1 ],
								[-0.5, 0.0,  0.5, 1 ]
                            ]
                        ]);

        this.initBuffers();
    }

    

    makeSurface(controlvertexes) {
		let nurbsSurface = new CGFnurbsSurface(1, 1, controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }
    
    initBuffers() {
        this.obj.initBuffers();
    }

    display() {
        this.obj.display();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		// NEED TO UPDATE THIS
		/*const dX = this.x2 - this.x1;
		const dY = this.y2 - this.y1;
		if (coords == undefined || typeof coords.afs != 'number' || typeof coords.aft != 'number') {
			console.warn("RECEIVED INVALID AFS & AFT");
			return;
        }

        this.obj.texCoords = [];
        for (let j = 0; j <= this.npartsV; j++) {
            for (let i = 0; i <= this.npartsU; i++) {
                this.obj.texCoords.push(i / this.npartsU, j / this.npartsV);
            }
        }

		this.obj.texCoords = [
			0, dY/coords.aft,
			dX/coords.afs, dY/coords.aft,
			0, 0,
			dX/coords.afs, 0
		]
		this.updateTexCoordsGLBuffers();*/
	}
}