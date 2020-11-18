/**
 * Patch primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {Number} npartsU - number of divisions on U direction
 * @param {Number} npartsV - number of divisions on V direction
 * @param
 */
class MyPatch extends CGFobject {
    constructor(scene, npartsU, npartsV, npointsU, npointsV, controlPoints) {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.nrDivs = this.npartsU * this.npartsV;

        this.xPatchLength = 1.0 / npartsU;
        this.yPatchLength = 1.0 / npartsV;

        this.initBuffers();

        this.makeSurface(/* ?? tenho que ver isto melhor */);
    }

    

    /*makeSurface(degree1, degree2, controlvertexes, translation) {
			
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		var obj = new CGFnurbsObject(this, 20, 20, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		
	}*/

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	/*updateTexCoords(coords) {
		const dX = this.x2 - this.x1;
		const dY = this.y2 - this.y1;
		if (coords == undefined || typeof coords.afs != 'number' || typeof coords.aft != 'number') {
			console.warn("RECEIVED INVALID AFS & AFT");
			return;
        }

        this.texCoords = [];
        for (let j = 0; j <= this.nrDivs; j++) {
            for (let i = 0; i <= this.nrDivs; i++) {
                this.texCoords.push(i / this.nrDivs, j / this.nrDivs);
            }
        }

		this.texCoords = [
			0, dY/coords.aft,
			dX/coords.afs, dY/coords.aft,
			0, 0,
			dX/coords.afs, 0
		]
		this.updateTexCoordsGLBuffers();
	}*/
}