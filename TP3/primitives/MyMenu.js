class MyMenu extends CGFobject {
    constructor(scene, buttons, title, appearance) {
        super(scene);

        this.title = title ? new MySpriteText(scene, title) : null;

        this.appearance = appearance;
        this.appearance.height = 60;
        this.appearance.width = aspectRatio*this.appearance.height; // aspect ratio is width/height
        this.appearance.availableWidth = this.appearance.width - 2*this.appearance.horizontalPadding;
        this.appearance.availableHeight = this.appearance.height - 2*this.appearance.verticalPadding;

        this.background = new MyPlane(scene, 60, 60);

        this.buttons = buttons;
    }

    display() {
        this.scene.pushMatrix();

        displayBackground();

        const realTitleSize = displayTitle();

        const grid = {
            width: this.appearance.availableWidth,
            height: this.appearance.availableHeight - realTitleSize.height - 1, // 1 is the title bottom margin
            top: this.appearance.verticalPadding + realTitleSize.height + 1,
            left: this.appearance.horizontalPadding,
            gap: this.appearance.gridGap
        }

        grid.cell = {
            width: (grid.width / this.appearance.cols) - ((this.appearance.cols - 1)*grid.gap),
            height: (grid.height / this.appearance.rows) - ((this.appearance.rows - 1)*grid.gap) 
        }

        // make sure that cells are square!!

        this.scene.popMatrix();
    }

    displayTitle() {
        if (!this.title) return { height: 0, width: 0 };

        const textSize = {
            height: this.title.getHeight(),
            width: this.title.getWidth()
        }

        let scaleAmount = 1;
        if (textSize.width > this.appearance.availableWidth) {
            let scaleAmount = 1 - ((textSize.width - this.appearance.availableWidth)/textSize.width);

            textSize.height = textSize.height*scaleAmount;
            textSize.width = textSize.width*scaleAmount;
        }

        this.scene.pushMatrix();

        // already translates with the updated dimensions
        this.scene.translate(textSize.width / 2., 0, this.appearance.verticalPadding + textSize.height / 2.);

        // scales to the right size
        if (scaleAmount != 1) this.scene.scale(scaleAmount, 1, scaleAmount);

        this.title.display();

        this.scene.popMatrix();
    }

    displayBackground() {
        this.scene.pushMatrix();

        this.scene.translate(this.appearance.width / 2., 0, this.appearance.height / 2.);
        this.scene.scale(this.appearance.width, 1, this.appearance.height);

        this.background.display();

        this.scene.popMatrix();
    }
}