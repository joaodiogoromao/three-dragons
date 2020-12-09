class MyStateWaiting extends MyState {
    constructor(scene, game) {
        super(scene, game);
        /*this.pickedPiece = null;
        this.currentAnimation = null;*/
    }

    update() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					let obj = this.scene.pickResults[i][0];
                    let id = this.scene.pickResults[i][1];
					if (id > 81) {
                        this.pickedPiece = obj;
                        console.log("Picked piece");
                        this.game.setState(new MyStatePiecePicked(this.scene, this.game, obj));
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
        }        
    }
}