class MyMenu extends CGFobject {
    constructor(scene, buttons, name, title, appearance) {
        super(scene);
        
        this.name = name;
        this.title = title ? new MySpriteText(scene, title) : null;

        this.appearance = appearance;
        this.appearance.height = 60;
        this.appearance.width = Math.round(this.appearance.aspectRatio*this.appearance.height); // aspect ratio is width/height
        this.appearance.availableWidth = this.appearance.width - 2*this.appearance.horizontalPadding;
        this.appearance.availableHeight = this.appearance.height - 2*this.appearance.verticalPadding;

        this.background = new MyPlane(scene, Math.round(60*this.appearance.aspectRatio), 60);

        this.titleBottomMargin = 1;

        this.buttons = buttons;

        this.calculateTitleSize();
        this.calculateGrid();
    }

    calculateTitleSize() {
        if (!this.title) return { height: 0, width: 0 };

        const scaleAmount = Math.min(5, this.appearance.availableWidth/this.title.getWidth());

        this.titleSize = {
            height: this.title.getHeight()*scaleAmount,
            width: this.title.getWidth()*scaleAmount,
            scaleAmount: scaleAmount
        }
    }

    calculateGrid() {
        this.grid = {
            width: this.appearance.availableWidth,
            height: this.appearance.availableHeight - this.titleSize.height - this.titleBottomMargin,
            top: this.appearance.verticalPadding + this.titleSize.height + this.titleBottomMargin,
            left: this.appearance.horizontalPadding,
            rows: this.appearance.rows,
            cols: this.appearance.cols,
            gap: this.appearance.gridGap
        };
        this.grid.cell = Math.min(  // calculates the cell dimensions
            (this.grid.width - (this.grid.cols - 1)*this.grid.gap) / this.grid.cols, 
            (this.grid.height - (this.grid.rows - 1)*this.grid.gap) / this.grid.rows
        );

        const realGridHeight = (this.grid.cell * this.grid.rows) + (this.grid.gap * (this.grid.rows - 1));
        const realGridWidth = (this.grid.cell * this.grid.cols) + (this.grid.gap * (this.grid.cols - 1));

        if (realGridHeight < this.grid.height) {
            this.grid.top += (this.grid.height - realGridHeight) / 2.;
        }
        if (realGridWidth < this.grid.width) {
            this.grid.left += (this.grid.width - realGridWidth) / 2.;
        }

        this.buttons.forEach((button) => button.init(this.grid.gap/this.grid.cell));
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.appearance.width / 2., 0, -this.appearance.height / 2.);

        this.displayBackground();
        if (this.title) this.displayTitle();
        this.displayButtons();

        this.scene.popMatrix();
    }

    displayButtons() {
        let count = 1;
        for (const button of this.buttons) {
            this.scene.pushMatrix();

            const buttonPos = button.gridPosition;

            const xPos = this.grid.left + ((buttonPos.col.start-1)*(this.grid.cell + this.grid.gap));
            const zPos = this.grid.top + ((buttonPos.row.start-1)*(this.grid.cell + this.grid.gap));

            this.scene.translate(xPos, 0, zPos);
            this.scene.scale(this.grid.cell, 1, this.grid.cell);

            this.scene.registerForPick(count, button);

            button.display();

            this.scene.popMatrix();
            count++;
        }
        this.scene.clearPickRegistration();
    }

    displayTitle() {
        if (!this.title) return;

        this.scene.pushMatrix();

        // already translates with the updated dimensions
        this.scene.translate(this.appearance.width / 2., 0.05, this.appearance.verticalPadding + this.titleSize.height / 2.);

        // scales to the right size
        if (this.titleSize.scaleAmount != 1) this.scene.scale(this.titleSize.scaleAmount, 1, this.titleSize.scaleAmount);

        this.scene.rotate(-DEGREE_TO_RAD*90, 1, 0, 0)

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