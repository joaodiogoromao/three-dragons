/**
 * @class MyLinearAnimation
 * Piece movement animation
 */
class MyLinearAnimation extends MyKeyframeAnimation {
    /**
     * @constructor
     * @param {CGFscene} scene the scene object
     * @param {Number} xOffset
     * @param {Number} zOffset
     * @param {Object} object the animation object
     * @param {Number} duration the duration of the animation
     */
    constructor(scene, currentTime, xOffset, zOffset, object, duration, frameNum) {
        const initTransformationObj = function(translation) {
            let transformationObj = {}
            transformationObj['scale'] = { sx: 1, sy: 1, sz: 1 };
            transformationObj['translation'] = {...translation};
            transformationObj['rotationX'] = { angle: 0, axis: 'x' };
            transformationObj['rotationY'] = { angle: 0, axis: 'y' };
            transformationObj['rotationZ'] = { angle: 0, axis: 'z' };
            return transformationObj;
        }
        console.log(xOffset, zOffset);
        const calculateKeyframeArray = function() {
            let xOffsetDelta = 0, zOffsetDelta = 0;
            let keyframes = [];
            let initialTime = currentTime;
            let finalTime = initialTime + duration;
            let timeOffset = (finalTime - initialTime) / frameNum;
            let time = initialTime;

            zOffsetDelta = (zOffset) / frameNum;
            xOffsetDelta = (xOffset) / frameNum;

            for (let i = 0; i < frameNum; i++) {
                let translation = {x: 0, y: 0, z: 0};
                translation.x = i*xOffsetDelta;
                translation.z = i*zOffsetDelta;
                /*let value = currentValues.z == 0 ? currentValues.x : currentValues.z;
                currentValues.y = Math.sqrt(radius*radius - value*value);*/
                time = i*timeOffset + initialTime;
                keyframes.push(new Keyframe(time, initTransformationObj(translation)));
            }
            return keyframes;
        }

        super(calculateKeyframeArray());
        this.scene = scene;
        this.xOffset = xOffset;
        this.zOffset = zOffset;
        this.object = object;
        this.duration = duration;
        this.frameNum = frameNum;
    }

    /**
     * @method initTransformationObj
     * Populates an array given as parameter with objects containing the default values for each transformation associated with a keyframe
     */
    initTransformationObj(translation) {
        let transformationObj = {}
        transformationObj['scale'] = { sx: 1, sy: 1, sz: 1 };
        transformationObj['translation'] = translation;
        transformationObj['rotationX'] = { angle: 0, axis: 'x' };
        transformationObj['rotationY'] = { angle: 0, axis: 'y' };
        transformationObj['rotationZ'] = { angle: 0, axis: 'z' };
        return transformationObj;
    }

    buildKeyframes() {
        let radius, xOffsetDelta, zOffsetDelta;
        let currentValues = {x: 0, y: 0, z: 0};
        let keyframes = [];
        let initialTime = performance.now() + 0.3;
        let finalTime = initialTime + this.duration;
        let timeOffset = (finalTime - initialTime) / this.frameNum;
        let time = initialTime;

        if (this.xOffset == 0) {
            radius = this.zOffset;
            xOffsetDelta = 0;
            zOffsetDelta = radius / this.frameNum;
        }
        else if (this.zOffset == 0) {
            radius = this.xOffset;
            zOffsetDelta = 0;
            xOffsetDelta = radius / this.frameNum;
        }

        for (let i = 0; i < this.frameNum; i++) {
            currentValues.x += xOffsetDelta;
            currentValues.z += zOffsetDelta;
            let value = currentValues.z == 0 ? currentValues.x : currentValues.z;
            currentValues.y = Math.sqrt(radius*radius - value*value);
            keyframes.push(new Keyframe(time, currentValues));
            time += timeOffset;
        }

        return keyframes;
    }
}