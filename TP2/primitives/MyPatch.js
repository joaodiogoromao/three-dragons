/**
 * Patch primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {Number} npartsU - number of divisions on U direction
 * @param {Number} npartsV - number of divisions on V direction
 * @param {Number} npointsU - number of U control points
 * @param {Number} npointsV - number of V control points
 * @param {Array<Object>} controlPoints Array of objects with xx, yy and zz attributes
 */
class MyPatch extends CGFobject {
    constructor(scene, npartsU, npartsV, npointsU, npointsV, controlPoints) {
        super(scene);

        this.npartsU = npartsU;
		this.npartsV = npartsV;
		this.npointsU = npointsU;
		this.npointsV = npointsV;
        this.nrDivs = this.npartsU * this.npartsV;

		this.makeSurface(npointsU-1, npointsV-1, controlPoints);
		
        this.initBuffers();
    }

	/**
	 * @method makeSurface
	 * Manipulates the array of control points given as parameter so that it has the right structure in order to call the function CGFnubsSurface.
	 * Creates an auxiliar object that represents the patch.
	 * @param {Number} degreeU number of divisions of the patch in the U direction.
	 * @param {Number} degreeV number of divisions of the patch in the U direction.
	 * @param {Array<Number>} controlPoints 
	 */
    makeSurface(degreeU, degreeV, controlPoints) {
		const cp = [];
		for (const i in controlPoints) {
			if (i % this.npointsV === 0) cp.push([]);
			cp[cp.length - 1].push([...Object.values(controlPoints[i]), 1]);
		}

		let nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, cp);
		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
	}

	/**
     * @method initBuffers
     * Calls initBuffer() function of auxiliar object that represents MyPatch
     */
	initBuffers() {
		this.obj.initBuffers();
	}

	/**
     * @method display
     * Calls display() function of auxiliar object that represents MyPatch
     */
	display() {
		this.obj.display();
	}
}