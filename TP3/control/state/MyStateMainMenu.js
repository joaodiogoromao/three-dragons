class MyStateMainMenu extends MyState{
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);
    }



    display() {
        
    }

    update() {
        if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					const obj = this.scene.pickResults[i][0];
					const id = this.scene.pickResults[i][1];
                    
                    if (id) actionGenerator[obj.action](this);
				}
				this.scene.discardPickResults();
			}
        }
    }
}