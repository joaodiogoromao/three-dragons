/**
 * @class MyCameraRotationUnit
 * Component of 
 */

class MyCameraRotationUnit {
    constructor(time, angle, applied) {
        this.time = time;
        this.angle = angle;
        this.applied = applied;
    }

    apply(camera) {
        this.applied = true;
        camera.orbit({X: (1, 0, 0), Y: (0, 1, 0), Z: (0, 0, 1)}, this.angle);
    }
}

/**
 * @class MyCameraAnimation
 * Camera movement animation
 */

class MyCameraAnimation {
    /**
     * @constructor
     * @param {CGFscene} scene the scene object
     * @param {Number} currentTime time animation was started
     * @param {Number} speed the speed of the animation
     * @param {Number} frameNum the number of frames of the animation
     */
    constructor(scene, currentTime, speed, frameNum) {
        this.scene = scene;
        this.speed = speed;
        this.frameNum = frameNum;
    }

    buildRotationUnits() {
        const rotationAngle = Math.PI;
        let transformations = [];

        const camera = scene.cameras.defaultCamera;
        const radius = camera.position.z;

        let duration = (Math.PI * radius) / speed;

        let initialTime = currentTime;
        let finalTime = initialTime + duration;
        let timeOffset = (finalTime - initialTime) / frameNum;
        let time = initialTime;

        angleDelta = (rotationAngle) / frameNum;

        for (let i = 0; i < frameNum; i++) {
            const currentAngle = i * angleDelta;
            time = i * timeOffset + initialTime;
            tranformations.push(new MyCameraRotationUnit(time, angleDelta, false));
        }
        return transformations;
    }

    update(currentTime) {
        const rotationUnits = this.buildRotationUnits();
        for (rotationUnit of rotationUnits) {
            if (currentTime >= rotationUnit.time) {
                if (!rotationUnit.applied) {
                    rotationUnit.apply(this.scene.cameras.defaultCamera);
                    return false;
                }
            }
        }
        return true;
    }
}