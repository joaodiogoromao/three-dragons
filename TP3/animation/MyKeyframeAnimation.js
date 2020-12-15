/**
 * @class Keyframe
 * Holds the keyframe instant and the corresponding transformation matrix
 */
class Keyframe {
    /**
     * @constructor
     * @param {Number} instant the instant when the keyframe's transformation matrix must be active
     * @param {Object} transf the transformation object
     */
    constructor(instant, transf) { this.instant = instant; this.transf = transf };
}

/**
 * @class MyKeyframeAnimation
 * @extends MyAnimation
 * Receices an array of Keyframe objects, and manages them in order to update the MyAnimation parent with the current animation
 */
class MyKeyframeAnimation extends MyAnimation{
    /**
     * @constructor
     * Constructs the parent object with the first two keyframes and stores values in the current class state
     * @param {Array<Keyframe>} keyframeArray the array with Keyframe objects, doesn't need to be ordered
     * @param {Boolean} infiniteReplay true if the animation loops, false otherwise
     */
    constructor(keyframeArray, infiniteReplay = false) {
        if (keyframeArray.length === 0) throw new Error("KeyframeAnimation needs at least 1 keyframe.");
        else if (keyframeArray.length === 1) {   // only 1 keyframe
            super(keyframeArray[0], keyframeArray[0]);
        } else {
            keyframeArray.sort((a, b) => a.instant - b.instant); // sorts array by keyframe instant in ascending order
            
            super(keyframeArray[0], keyframeArray[1]);
        }
        console.log(keyframeArray);
        
        this.keyframeArray = keyframeArray;
        this.infiniteReplay = infiniteReplay;

        // how long until the final animation state is reached
        this.finalKeyframeInstant = this.keyframeArray[this.keyframeArray.length -1].instant;  // array is ordered by instant

        this.replayCount = 0; // the number of times that the animation was repeated (used in case infiniteReplay == false)
    }

    /**
     * @method getPrevNextFrame
     * Gets the previous and the next keyframe in the animation
     * @param {Number} currentTime time since animation started in seconds
     * @return null if next frame is not found, object with 'prev' and 'next' attributes otherwise
     */
    getPrevNextFrame(currentTime) {
        const previousFrame = this.getPrevFrame(currentTime);
        const nextFrame = this.getNextFrame(currentTime);
        
        return nextFrame === null ? null : {prev: previousFrame, next: nextFrame};
    }

    /**
     * @method restartAnimation
     * Restarts the animation. Returns the previous and the next keyframes. Used case 'this.infiniteReplay' is true.
     * @param {Number} currentTime time since animation started in seconds
     * @return null if next frame is not found, object with 'prev' and 'next' attributes otherwise
     */
    restartAnimation(currentTime) {
        this.replayCount++;
        currentTime -= this.finalKeyframeInstant;   // updates the current time, taking out the time that the animation took
        return this.getPrevNextFrame(currentTime);
    }

    /**
     * @method currentTime
     * Obtains the currentTime (time since animation started) from the time since the program started, taking into account the amount of times that the animation was repeated
     * @param {Number} timeSinceProgramStarted time since the program started in seconds
     * @return time since animation started in seconds
     */
    currentTime(timeSinceProgramStarted) {
        return timeSinceProgramStarted - (this.replayCount*this.finalKeyframeInstant);
    }

    /**
     * @method update
     * Updates the keyframe animation. Calls super.update, and if the current animation in super is ended, 
     * reconfigures the super's animation variables to accomodate the next two keyframes in the animation
     * @param {Number} timeSinceProgramStarted time since the program started in seconds
     */
    update(timeSinceProgramStarted) {
        let currentTime = this.currentTime(timeSinceProgramStarted);

        // resets the currentTime in case this.infiniteReplay is true and there are any inconsistensies
        if (Math.floor(currentTime) > this.finalKeyframeInstant && this.infiniteReplay) {  // this may happen if the tab becomes inactive (the loop is inactive)
            this.replayCount += Math.floor(currentTime/this.finalKeyframeInstant);
            currentTime = this.currentTime(timeSinceProgramStarted);
        }

        // Updates the super's animation variables, if the current super animation is over (Changes to the next two keyframes)
        if (super.update(currentTime)) {

            // in case the previous two keyframes finished interpolating
            // gets the next two
            let animationVars = this.getPrevNextFrame(currentTime);

            /* if animationVars are null, the keyframe animation is over. If infinite replay is ON, restarts the animation*/
            if (animationVars == null && this.infiniteReplay) animationVars = this.restartAnimation(currentTime);
            if (animationVars == null) return true;


            super.setAnimationVariables(animationVars.prev, animationVars.next);   // updates the super's animations
        }
    }

    /**
     * @method copy
     * Copies the object
     * @return the copy
     */
    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    /**
     * @method getPrevFrame
     * Gets the previous frame in the animation
     * @param {Number} currentTime time since animation started in seconds
     * @return the previous frame
     */
    getPrevFrame(currentTime) {
        // gets the frame that is closest to the current time, taking preference over frames that are before the current time
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
    
    /**
     * @method getNextFrame
     * Gets the next frame in the animation
     * @param {Number} currentTime time since animation started in seconds
     * @return the next frame
     */
    getNextFrame(currentTime) {
        // the next frame is the first frame in the array that has 'instant' greater than the 'currentTime', because the array is ordered
        for (let i = 0; i < this.keyframeArray.length; i++){
            if (this.keyframeArray[i].instant > currentTime)
                return this.keyframeArray[i];
        }
        return null;
    }
}