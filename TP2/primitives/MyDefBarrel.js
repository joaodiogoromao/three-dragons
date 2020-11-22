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
        let h = (4/3)*this.base;
        //let alpha = 30*Math.PI/180;
        //if (H < 0 && this.height > 0) alpha *= -1;
        
        const ret = [];
        let baseH = this.base + H;
        let base = this.base;
        let hH = null;
        for (let i = 0; i < 4; i++){
            if (i > 1 && baseH > 0 && this.base > 0) {
                baseH *= -1;
                base *= -1;
            }
            if (i == 0 || i == 3){
                h = 0;
                hH = 0;
            }else{
                h = (4/3)*this.base;
                hH = h + H;
            }
            ret.push([base * surfaceNumber, h * surfaceNumber, 0]);
            ret.push([baseH * surfaceNumber, hH * surfaceNumber, /*H/Math.tan(alpha)*/ this.height / 3]);   // not using the default angle because the barrel wouldn't look like a barrel for some values
            ret.push([baseH * surfaceNumber, hH * surfaceNumber, /*this.height - (H/Math.tan(alpha))*/ 2 * this.height / 3]);
            ret.push([base * surfaceNumber, h * surfaceNumber, this.height]);
        }

        /*
        console.log(ret);

        let right = [
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

        console.log(right);*/

        return ret;
    }

	initBuffers() {
        this.surface1 = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints(-1));
        this.surface2 = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.createControlPoints(1));
	}

	display() {
        this.surface1.display();
        this.surface2.display();
	}
}