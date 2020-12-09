

class MyGame {
    constructor(scene, board) {
        this.board = board;
        this.scene = scene;
        this.pickedPiece = null;
        this.currentAnimation = null;
    }

    update(timeSinceProgramStarted) {

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
                    var id = this.scene.pickResults[i][1];
					if (id > 81) {
                        this.pickedPiece = obj;
						console.log("Picked piece");						
					} else {
                        if (this.pickedPiece != null) {
                            const startPos = this.pickedPiece.position;
                            const endPos = { x: ((id-1)%9)+1, z: Math.floor(id/9)+1 };
                            this.currentAnimation = new MyLinearAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, this.pickedPiece, 2, 20);
                            this.pickedPiece.animation=this.currentAnimation;
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

