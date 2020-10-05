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

        var angle = 2*Math.PI / this.slices;

        for (var nstack = 0, v = 0; nstack <= this.stacks; nstack++, v = nstack / this.stacks){
            var stack_height = this.heigth * nstack / this.stacks;
            var increment_angle = 0;
            var current_radius = 0;

            if (this.topRadius >= this.bottomRadius) 
                current_radius = (this.topRadius - this.bottomRadius) * (nstack / this.stacks) + this.bottomRadius;
            else
                current_radius = this.bottomRadius - (this.bottomRadius - this.topRadius) * (nstack / this.stacks);

            for (var nslice = 0, u = 0; nslice <= this.slices; nslice++, u = nslice / this.slices){
                var x = Math.cos(angle) * current_radius;
                var y = Math.sin(angle) * current_radius;

                this.vertices.push(x, y, stack_height);
                this.normals.push(x, y, 0);

                this.texCoords.push(u, v);
                increment_angle += angle;
            }
        }

        const offset = this.slices + 1;
        for (var nstack = 0; nstack < this.stacks; nstack++) {
            const bottomOffset = nstack * offset;
            const topOffset = (nstack + 1) * offset;
            
            for (var nslice = 0; nslice < this.slices; nslice++){
                var a = nslice + bottomOffset;
                var b = nslice + bottomOffset + 1;
                var c = nslice + topOffset;
                var d = nslice + topOffset + 1;

                this.indices.push(a, b, d);
                this.indices.push(d, c, a);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}