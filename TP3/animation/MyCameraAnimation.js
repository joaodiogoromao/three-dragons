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
    constructor(scene, currentTime, time) {
        this.scene = scene;
        this.previousTime = currentTime;
        this.time = time;
        this.currentAngle = 0;
    }

    /**
	 * @method update
     * Updates de camera animation
	 * @param {Number} currentTime time since animation started in seconds
	 * @return true when the animation ends, null otherwise
	 */
    update(currentTime) {
        if (this.currentAngle >= Math.PI) return true;
        const angle = Math.PI;

        const timeRatio = (currentTime - this.previousTime) / this.time;
        let increment = angle * timeRatio;
        this.currentAngle += increment;
        this.previousTime = currentTime;

        if (this.currentAngle > Math.PI) increment -= this.currentAngle - Math.PI;

        const camera = this.scene.cameras.defaultCamera;
        camera.orbit({X: (1, 0, 0), Y: (0, 1, 0), Z: (0, 0, 1)}, increment);
    }
}