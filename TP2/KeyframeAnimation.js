/**
 * @class KeyframeAnimation
 */
class KeyframeAnimation extends Animation{

    constructor(keyframeArray) {
        this.keyframeArray = keyframeArray;
        this.currentState = keyframeArray;
    }

    update(currentTime) {
        if (!this.active)
            return;

        //Calculate elapsed time
        this.elapsedTime = currentTime - this.startTime;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        //Get previous and next frame
        this.previousFrame = this.getPreviousFrame();
        this.nextFrame = this.getNextFrame();

    }

    apply() {

    }

    getPreviousFrame() {

    }

    getNextFrame() {

    }
    
}