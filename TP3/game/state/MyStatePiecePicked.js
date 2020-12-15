class MyStatePiecePicked extends MyState {
    constructor(scene, game, piece) {
        super(scene, game);
        this.piece = piece;
    }

    update(timeSinceProgramStarted) {
        console.log('waiting for place');
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {

					const obj = this.scene.pickResults[i][0];
                    const id = this.scene.pickResults[i][1];

                    if (id <= 81) {
                        const startPos = this.piece.position;
                        const endPos = { x: ((id-1)%9)+1, z: Math.floor((id-1)/9)+1 };

                        if (isNaN(endPos.x) || isNaN(endPos.z)) continue;
                        const animation = new MyLinearAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, this.pickedPiece, 2, 20);
                        this.piece.animation = animation;
                        this.piece.position = endPos;
                        this.piece = null;
                        this.game.setState(new MyStateMoving(this.scene, this.game, animation));
                        return;
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }
}