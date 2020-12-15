class MyStateWaiting extends MyState {
    constructor(scene, game) {
        super(scene, game);
        this.game = game;
        console.log(game);
        /*this.pickedPiece = null;
        this.currentAnimation = null;*/
    }

    update() {
        console.log('waiting');
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					const obj = this.scene.pickResults[i][0];
                    const id = this.scene.pickResults[i][1];
					if (id > 81) {
                        console.log("Picked piece");
                        this.game.setState(new MyStatePiecePicked(this.scene, this.game, obj));
                        return;
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
        }        
    }
}