class MyDefBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        const H = (4/3)*(this.middle-this.base);
        const alpha = 30*Math.DEGREES_TO_RAD;

        this.q1 = [this.base, 0, 0];
        this.q2 = [this.base + H, 0, H/Math.tan(alpha)];
        this.q3 = [this.base + H, 0, height - (H/Math.tan(alpha))];
        this.q4 = [this.base, 0, height];

        this.initBuffers();
    }

    createControlPoints() {
        const ret = [];

        const H = (4/3)*(this.middle-this.base);
        const alpha = 30*Math.PI/180;

        for (let i = 0; i < 4; i++){
            let angle = i * Math.PI/2.0; 
            ret.push([this.base * Math.cos(angle), this.base * Math.sin(angle), 0]);
            ret.push([(this.base + H) * Math.cos(angle), (this.base + H) * Math.sin(angle), this.height - (H/Math.tan(alpha))]);
            ret.push([(this.base + H) * Math.cos(angle), (this.base + H) * Math.sin(angle), H/Math.tan(alpha)]);
            ret.push([this.base * Math.cos(angle), this.base * Math.sin(angle), this.height]);
        }

        console.log(ret);
        return ret;
    }

	initBuffers() {
        this.obj = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints());
	}

	display() {
        this.obj.display();
	}
}