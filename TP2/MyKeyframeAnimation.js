/**
 * @class KeyframeAnimation
 */
class MyKeyframeAnimation extends MyAnimation{

    constructor(keyframeArray) {
        if (keyframeArray.length < 2) throw new Error("KeyframeAnimation needs at least 2 keyframes.");
        super(keyframeArray[0], keyframeArray[1]);
        this.keyframeArray = keyframeArray;
        //console.log("Hello from the other side.")
    }

    update(currentTime) {
        //console.log("KeyframeAnimation update");
        //Get previous and next frame
        //console.log(this.endTime, currentTime);
        if (super.update(currentTime)) {
            const previousFrame = { instant: this.endTime, transf: this.endTrans };
            const nextFrame = this.getNextFrame(currentTime);
            //console.log("Next frame: ", nextFrame);
            if (nextFrame == null) return;
            //console.log("Setting animation variables!!");
            super.setAnimationVariables(previousFrame, nextFrame);
            //console.log("New vars: " + this.startTime, this.endTime);
        }
    }

    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    
    getNextFrame(currentTime) {
        for (let i = 0; i < this.keyframeArray.length; i++){
            if (this.keyframeArray[i].instant > currentTime)
                return this.keyframeArray[i];
        }
        return null;
    }
}