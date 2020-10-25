/**
 * Torus primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {Number} inner - inner radius
 * @param {Number} outer - outer radius
 * @param {Number} slices - sections around the inner radius
 * @param {Number} loops - sections around the outer radius
 */
class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the torus buffers
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let slicesDone = 0, v = 0, teta = 0; 
            slicesDone <= this.slices; 
            slicesDone++, v = slicesDone/this.slices, teta = v*2*Math.PI) {

            for (let loopsDone = 0, u = 0, phi = 0; 
                loopsDone <= this.loops; 
                loopsDone++, u = loopsDone/this.loops, phi = u*2*Math.PI) {

                this.vertices.push((this.outer + this.inner*Math.cos(teta))*Math.cos(phi)); // x = (R + r*cos(teta))*cos(phi)
                this.vertices.push((this.outer + this.inner*Math.cos(teta))*Math.sin(phi)); // y = (R + r*cos(teta))*sin(phi)
                this.vertices.push(this.inner*Math.sin(teta)); // z = r*sin(teta)

                this.normals.push(Math.cos(teta)*Math.cos(phi)); // x = cos(teta)*cos(phi)
                this.normals.push(Math.cos(teta)*Math.sin(phi)); // y = cos(teta)*sin(phi)
                this.normals.push(Math.sin(teta)); // z = sin(teta)
            
                this.texCoords.push(u, v);
            }
        }

        for (let slice = 0; slice < this.slices; slice++) {
            const offset = this.loops+1;
            const currentOffset = slice*offset;
            for (let loop = 0; loop < this.loops; loop++) {
                this.indices.push(loop + currentOffset);
                this.indices.push(loop + currentOffset + 1);
                this.indices.push(loop + currentOffset + offset);

                this.indices.push(loop + currentOffset + offset);
                this.indices.push(loop + currentOffset + 1);
                this.indices.push(loop + currentOffset + offset + 1);
            }
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}