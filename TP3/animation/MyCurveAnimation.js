/**
 * @class MyCurveAnimation
 * Piece movement animation
 */
class MyCurveAnimation extends MyKeyframeAnimation {
    /**
     * @constructor
     * @param {CGFscene} scene the scene object
     * @param {Number} xOffset
     * @param {Number} zOffset
     * @param {Number} speed the speed of the animation
     * @param {Number} frameNum the number of frames of the animation
     */
    constructor(scene, currentTime, xOffset, zOffset, speed, frameNum) {        
        const initTransformationObj = function (translation) {
            let transformationObj = {};
            transformationObj['translation'] = { ...translation };
            return transformationObj;
        }
        
        /**
         * @method calculateKeyframeArray create the keyframe array to animate piece movement
         */
        const calculateKeyframeArray = function () {
            let xOffsetDelta = 0, zOffsetDelta = 0;
            let keyframes = [];

            let radius = Math.sqrt(xOffset * xOffset + zOffset * zOffset) / 2;
            let duration = (Math.PI * radius) / speed;

            if (2*radius < 4) frameNum = 10 * radius;

            let initialTime = currentTime;
            let finalTime = initialTime + duration;
            let timeOffset = (finalTime - initialTime) / frameNum;
            let time = initialTime;

            zOffsetDelta = (zOffset) / frameNum;
            xOffsetDelta = (xOffset) / frameNum;

            for (let i = 0; i < frameNum; i++) {
                let translation = { x: 0, y: 0, z: 0 };
                translation.x = i * xOffsetDelta ;//- xOffset;
                translation.z = i * zOffsetDelta ;//- zOffset;

                let currentDistance = Math.sqrt(translation.x * translation.x + translation.z * translation.z);

                let distanceFromCenter = radius - currentDistance;
                translation.y = Math.min(Math.sqrt(radius * radius - distanceFromCenter * distanceFromCenter) * 1.5, 5000);

                time = i * timeOffset + initialTime;
                keyframes.push(new Keyframe(time, initTransformationObj(translation)));
            }

            keyframes.push(new Keyframe(finalTime, initTransformationObj({ x: xOffset, y: 0, z: zOffset })));

            return keyframes;
        }

        super(calculateKeyframeArray());
        this.scene = scene;
        this.xOffset = xOffset;
        this.zOffset = zOffset;
        this.speed = speed;
        this.frameNum = frameNum;
    }

    /**
     * @method createPieceMovingAnimation create an instance of MyCurveAnimation
     * @param {Object} piece the piece object to animate
     * @param {Number} timeSinceProgramStarted
     * @param {Number} startPos animation final position
     * @param {Number} endPos animation final position
     */
    static createPieceMovingAnimation(piece, timeSinceProgramStarted, startPos, endPos) {
        const animation = new MyCurveAnimation(this.scene, timeSinceProgramStarted, endPos.x-startPos.x, endPos.z-startPos.z, 10, 15);
        piece.animation = animation;
        return animation;
    }
}