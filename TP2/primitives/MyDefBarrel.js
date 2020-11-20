class MyDefBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        /*const H = (4/3)*(this.middle-this.base);
        const alpha = 30*Math.DEGREES_TO_RAD;

        this.q1 = [this.base, 0, 0];
        this.q2 = [this.base + H, 0, H/Math.tan(alpha)];
        this.q3 = [this.base + H, 0, height - (H/Math.tan(alpha))];
        this.q4 = [this.base, 0, height];*/

        this.initBuffers();
    }

    createControlPoints(surfaceNum) {
        const ret = [];

        const H = (4/3)*(this.middle-this.base);
        const alpha = 30*Math.PI/180;

        for (let i = 0; i < 4; i++){
            let angle = i * Math.PI/3.0;
            ret.push([this.base * Math.cos(angle) * surfaceNum, this.base * Math.sin(angle) * surfaceNum, 0]);
            ret.push([(this.base + H) * Math.cos(angle) * surfaceNum, (this.base + H) * Math.sin(angle) * surfaceNum, this.height/3]);
            ret.push([(this.base + H) * Math.cos(angle) * surfaceNum, (this.base + H) * Math.sin(angle) * surfaceNum, 2*this.height/3]);
            ret.push([this.base * Math.cos(angle) * surfaceNum, this.base * Math.sin(angle) * surfaceNum, this.height]);
        }

        console.log(ret);
        return ret;
    }

	initBuffers() {
        this.surface1 = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints(1));
        this.surface2 = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints(-1));
	}

	display() {
        this.surface1.display();
        this.surface2.display();
	}
}