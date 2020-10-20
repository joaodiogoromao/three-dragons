class MyTriangle extends CGFobject{
    constructor(scene, coords, afs, aft){
        super(scene);

        this.point1 = [coords[0], coords[1]];
        this.point2 = [coords[2], coords[3]];
        this.point3 = [coords[4], coords[5]];
        this.points = [this.point1, this.point2, this.point3];

        this.afs = afs;
        this.aft = aft;

        this.initBuffers();
    }

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

        this.texCoords = this.findTexCoords(1,1);

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    findTexCoords(length_u, length_v){
        var ret = [];
        var a = this.distance_points(this.point1, this.point2);
        var b = this.distance_points(this.point2, this.point3);
        var c = this.distance_points(this.point1, this.point3);

        var cos_alpha = (a*a - b*b + c*c) / (2 * a * c)
        var sin_alpha = Math.sqrt(1 - Math.pow(cos_alpha, 2));

        ret.push(0, 0);
        ret.push(a/length_u, 0);
        ret.push((c*cos_alpha)/length_u, c*sin_alpha/length_v);

        return ret;
    }

    distance_points(point1, point2){
        return Math.sqrt(Math.pow(point2[0]-point1[0], 2) + Math.pow(point2[1]-point1[1], 2))
    }

    updateTexCoords() {
        
    }
}