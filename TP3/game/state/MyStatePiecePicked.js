class MyStatePiecePicked extends MyState {
    constructor(scene, game, piece) {
        super(scene, game);
        this.piece = piece;
    }

    update(timeSinceProgramStarted) {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
                    const startPos = this.pickedPiece.position;
                    const endPos = { x: ((id-1)%9)+1, z: Math.floor((id-1)/9)+1 };

                    if (isNaN(endPos.x) || isNaN(endPos.z)) continue;
                    this.currentAnimation = new MyLinearAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, this.pickedPiece, 2, 20);
                    this.pickedPiece.animation = this.currentAnimation;
                    this.pickedPiece.position = endPos;
                    this.pickedPiece = null;
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }
}