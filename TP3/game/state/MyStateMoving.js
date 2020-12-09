class MyStateMoving extends MyState {
    constructor(scene, game) {
        super(scene, game);
        this.game = game;
    }

    update(timeSinceProgramStarted) {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					let obj = this.scene.pickResults[i][0];
                    let id = this.scene.pickResults[i][1];
					if (id > 81) {
                        this.pickedPiece = obj;
						console.log("Picked piece");						
					} else {
                        if (this.pickedPiece != null) {
                            const startPos = this.pickedPiece.position;
                            const endPos = { x: ((id-1)%9)+1, z: Math.floor((id-1)/9)+1 };
                            console.log("id:", id, "start pos: ", startPos)
                            console.log("end pos: ", endPos)
                            if (isNaN(endPos.x) || isNaN(endPos.z)) continue;
                            this.currentAnimation = new MyLinearAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, this.pickedPiece, 2, 20);
                            this.pickedPiece.animation = this.currentAnimation;
                            this.pickedPiece.position = endPos;
                            this.pickedPiece = null;
                        }
                    }
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
        }
        
        if (this.currentAnimation != null && this.currentAnimation.update(timeSinceProgramStarted) === true) {
            this.currentAnimation = null;
        }
        
    }
}