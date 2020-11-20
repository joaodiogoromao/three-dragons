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

    createControlPoints(surfaceNumber) {
        const H = (4/3)*(this.middle-this.base);
        const h = (4/3)*this.base;
        const alpha = 30*Math.PI/180;

        return [
            [this.base * surfaceNumber, 0, 0],
            [(this.base + H) * surfaceNumber, 0, H/Math.tan(alpha)],
            [(this.base + H) * surfaceNumber, 0, this.height - (H/Math.tan(alpha))],
            [this.base * surfaceNumber, 0, this.height],

            [this.base * surfaceNumber, h * surfaceNumber, 0],
            [(this.base + H) * surfaceNumber, (h + H) * surfaceNumber, H/Math.tan(alpha)],
            [(this.base + H) * surfaceNumber, (h + H) * surfaceNumber, this.height - (H/Math.tan(alpha))],
            [this.base * surfaceNumber, h * surfaceNumber, this.height],

            [-this.base * surfaceNumber, h * surfaceNumber, 0],
            [(-this.base - H) * surfaceNumber, (h + H) * surfaceNumber, H/Math.tan(alpha)],
            [(-this.base - H) * surfaceNumber, (h + H) * surfaceNumber, this.height - (H/Math.tan(alpha))],
            [-this.base * surfaceNumber, h * surfaceNumber, this.height],

            [-this.base * surfaceNumber, 0, 0],
            [(-this.base - H) * surfaceNumber, 0, H/Math.tan(alpha)],
            [(-this.base - H) * surfaceNumber, 0, this.height - (H/Math.tan(alpha))],
            [-this.base * surfaceNumber, 0, this.height]
        ];
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