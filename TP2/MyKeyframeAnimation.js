/**
 * @class KeyframeAnimation
 */
class MyKeyframeAnimation extends MyAnimation{

    constructor(keyframeArray, infiniteReplay = false) {
        if (keyframeArray.length === 0) throw new Error("KeyframeAnimation needs at least 1 keyframe.");
        else if (keyframeArray.length === 1) {
            super(keyframeArray[0], keyframeArray[0]);
        } else {
            let first = keyframeArray[0], second = keyframeArray[1];
            for (const kf of keyframeArray) {
                if (kf.instant < first) {
                    if (first < second) second = first;
                    first = kf;
                } else if (kf.instant < second.instant) {
                    second = kf;
                }
            }
            
            super(first, second);
        }
        
        this.keyframeArray = keyframeArray;
        this.infiniteReplay = infiniteReplay;

        this.finalKeyframeInstant = this.getAnimationFinalInstant();
        this.replayCount = 0;
        //console.log("Hello from the other side.")
    }

    getAnimationFinalInstant() {
        return this.keyframeArray.reduce((accumulator, current) => current.instant > accumulator.instant ? current : accumulator).instant;
    }

    getPrevNextFrame(currentTime) {
        const previousFrame = this.getPrevFrame(currentTime);
        const nextFrame = this.getNextFrame(currentTime);
        
        return nextFrame === null ? null : {prev: previousFrame, next: nextFrame};
    }

    restartAnimation(currentTime) {
        this.replayCount++;
        currentTime -= this.finalKeyframeInstant;
        return this.getPrevNextFrame(currentTime);
    }

    currentTime(timeSinceProgramStarted) {
        //console.log("Calculating current time. timeSinceProgramStarted: " + timeSinceProgramStarted + ", replayCount: " + this.replayCount + ", finalKeyFrameInstant: ", this.finalKeyframeInstant)
        return timeSinceProgramStarted - (this.replayCount*this.finalKeyframeInstant);
    }

    update(timeSinceProgramStarted) {
        //console.log("KeyframeAnimation update");
        //Get previous and next frame
        //console.log(this.endTime, currentTime);
        let currentTime = this.currentTime(timeSinceProgramStarted);
        if (Math.floor(currentTime) > this.finalKeyframeInstant) {  // this may happen if the tab becomes inactive (the loop is inactive)
            this.replayCount += Math.floor(currentTime/this.finalKeyframeInstant);
            currentTime = this.currentTime(timeSinceProgramStarted);
        }
        if (super.update(currentTime)) {
            //console.log("Next frame: ", nextFrame);
            let animationVars = this.getPrevNextFrame(currentTime);
            if (animationVars == null && this.infiniteReplay) animationVars = this.restartAnimation(currentTime);
            if (animationVars == null) return;

            //console.log("Setting animation variables!!");
            super.setAnimationVariables(animationVars.prev, animationVars.next);
            //console.log("New vars: " + this.startTime, this.endTime);
        }
    }

    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    getPrevFrame(currentTime) {
        return this.keyframeArray.reduce((accumulator, current) => {
            const accumVar = accumulator.instant - currentTime;
            const currentVar = current.instant - currentTime;
            if (Math.abs(currentVar) < Math.abs(accumVar)) {
                if (currentVar < 0) return current;
                if (accumVar < 0) return accumulator;
                return current;
            } else {
                if (accumVar < 0) return accumulator;
                if (currentVar < 0) return current;
                return accumulator;
            }    
        });
    }
    
    getNextFrame(currentTime) {
        //console.log('getNextFrame current time: ' + currentTime)
        for (let i = 0; i < this.keyframeArray.length; i++){
            if (this.keyframeArray[i].instant > currentTime)
                return this.keyframeArray[i];
        }
        return null;
    }
}