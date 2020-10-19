class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices){
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.angle = 2*Math.PI / this.slices;
        
        for (var nstack = 0, v = 0; nstack <= this.stacks; nstack++, v = nstack / this.stacks){
            var stack_height = this.height * nstack / this.stacks;
            var increment_angle = 0;
            var current_radius = 0;

            if (this.topRadius >= this.bottomRadius) 
                current_radius = (this.topRadius - this.bottomRadius) * (nstack / this.stacks) + this.bottomRadius;
            else
                current_radius = this.bottomRadius - (this.bottomRadius - this.topRadius) * (nstack / this.stacks);

            for (var nslice = 0, u = 0; nslice <= this.slices; nslice++, u = nslice / this.slices){
                var x = Math.cos(increment_angle) * current_radius;
                var y = Math.sin(increment_angle) * current_radius;

                this.vertices.push(x, y, stack_height);
                this.normals.push(x, y, 0);
                this.texCoords.push(u, v);

                increment_angle += this.angle;
            }
        }

        this.generateCircle(0, -1, this.bottomRadius);
        this.generateCircle(this.height, 1, this.topRadius);

        this.generateCenterVertex(0, -1);
        this.generateCenterVertex(this.height, 1);

        const centerBottomIndex = (this.slices + 1) * (this.stacks + 3);
        const centerTopIndex = (this.slices + 1) * (this.stacks + 3) + 1;
        const firstCircleIndex = (this.slices + 1) * (this.stacks + 1);

        for (var nstack = 0; nstack < this.stacks; nstack++) {
            const bottomOffset = nstack * (this.slices + 1);
            const topOffset = (nstack + 1) * (this.slices + 1);
            
            for (var nslice = 0; nslice < this.slices; nslice++){
                var a = nslice + bottomOffset;
                var b = nslice + bottomOffset + 1;
                var c = nslice + topOffset;
                var d = nslice + topOffset + 1;

                this.indices.push(a, b, d);
                this.indices.push(d, c, a);

                if (nstack == 0) {
                    a = nslice + firstCircleIndex;
                    b = nslice + firstCircleIndex + 1;
                    this.indices.push(b, a, centerBottomIndex);
                } 
                if (nstack == this.stacks - 1) {
                    c = nslice + firstCircleIndex + this.slices + 1;
                    d = nslice + firstCircleIndex + this.slices + 2;
                    this.indices.push(c, d, centerTopIndex);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    generateCircle(height, value, radius){
        var increment_angle = 0;
        
        for (var nslice = 0; nslice <= this.slices; nslice++){
            var x = Math.cos(increment_angle) * radius;
            var y = Math.sin(increment_angle) * radius;

            this.vertices.push(x, y, height);
            this.normals.push(0, 0, value);
            this.texCoords.push(Math.cos(increment_angle), Math.sin(increment_angle));
            increment_angle += this.angle;
        }
    }

    generateCenterVertex(height, value){
        this.vertices.push(0, 0, height);
        this.normals.push(0, 0, value);
        this.texCoords.push(0.5, 0.5);
    }
}