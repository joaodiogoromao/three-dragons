/**
 * Triangle primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param coords - object with attributes x1, y1, x2, y2, x3, y3
 */
class MyTriangle extends CGFobject{
    constructor(scene, coords){
        super(scene);

        this.point1 = [coords.x1, coords.y1];
        this.point2 = [coords.x2, coords.y2];
        this.point3 = [coords.x3, coords.y3];
        this.points = [this.point1, this.point2, this.point3];

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the triangle buffers
     */
    initBuffers(){
        this.vertices = [];
        for (var i = 0; i < this.points.length; i++)
            this.vertices.push(this.points[i][0], this.points[i][1], 0);

        this.indices = [0, 1, 2];
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = this.findTexCoords(1, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    /**
     * @method findTexCoords
     * @param length_u afs
     * @param length_v aft
     * @return the texcoords calculated based on length_u and length_v
     */
    findTexCoords(length_u, length_v){
        var ret = [];
        var a = this.distance_points(this.point1, this.point2);
        var b = this.distance_points(this.point2, this.point3);
        var c = this.distance_points(this.point1, this.point3);

        var cos_alpha = (a*a - b*b + c*c) / (2 * a * c)
        var sin_alpha = Math.sqrt(1 - Math.pow(cos_alpha, 2));

        ret.push(0, 1);
        ret.push(a/length_u, 1);
        ret.push((c*cos_alpha)/length_u, 1 - (c*sin_alpha/length_v));

        return ret;
    }

    /**
     * @method distance_points
     * @param {Array[Number]} point1 array with two number values
     * @param {Array[Number]} point2 array with two number values
     * @return the distance between the given points
     */
    distance_points(point1, point2){
        return Math.sqrt(Math.pow(point2[0]-point1[0], 2) + Math.pow(point2[1]-point1[1], 2))
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
		if (coords == undefined || typeof coords.afs != 'number' || typeof coords.aft != 'number') {
			console.warn("RECEIVED INVALID AFS & AFT");
			return;
        }
        
		this.texCoords = this.findTexCoords(coords.afs, coords.aft);
		this.updateTexCoordsGLBuffers();
    }
}