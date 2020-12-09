/**
 * Abstract Class MyAnimation
 *
 * @class MyAnimation
 * Interpolates between a start and an end state of transformations, with the duration specified
 */
class MyAnimation {
	/**
	 * MyAnimation
	 * @constructor
	 * @param {Keyframe} start The start keyframe
	 * @param {Keyframe} end The end keyframe
	 */
	constructor(start, end) {
		if (this.constructor == MyAnimation) {
			throw new Error("Abstract classes can't be instantiated.");
		}
		this.axisCoords = [];
		this.axisCoords['x'] = [1, 0, 0];
		this.axisCoords['y'] = [0, 1, 0];
		this.axisCoords['z'] = [0, 0, 1];

		this.setAnimationVariables(start, end);
		this.transfMx = null;

		this.endedAnimation = false;
	}

	/**
	 * @method setAnimationVariables
	 * Sets the class state to match the given start and end states to animate
	 * @param {Keyframe} start The start keyframe
	 * @param {Keyframe} end The end keyframe
	 */
	setAnimationVariables(start, end) {
		this.startTime = start.instant; // the current animation starts in this instant
		this.startTrans = start.transf; // start transformation matrix

		this.endTime = end.instant; // the current animation ends in this instant
		this.endTrans = end.transf; // end transformation matrix

		this.endedAnimation = false;
	}

	/**
	 * @method update
	 * Updates the class property 'this.transfMx' to match the transformation matrix of the current instant
	 * if the 'start' instant hasn't been reached yet, transfMx is null.
	 * @param {Number} currentTime time since animation started in seconds
	 * @return true when the animation ends, null otherwise
	 */
	update(currentTime) {

		// if the 'start' instant hasn't been reached yet
		// OBJECT DOESN'T APPEAR
		if (currentTime < this.startTime) {
			//console.log("Not started yet");
			this.transfMx = null;
			return;
		}

		const elapsedTime = currentTime - this.startTime;
		let interpolationAmount = elapsedTime / (this.endTime - this.startTime);  // from 0 to 1, where 0 is the start instant and 1 is the end instant

		// If the end instant has been reached but the end frame wasn't drawn
		if (currentTime > this.endTime && !this.endedAnimation) {
			interpolationAmount = 1;// forces the end instant to be drawn
		} else if (currentTime > this.endTime) return;   // if the end instant has been surpassed and the end frame was drawn; 
														 // it means that the animation is over and it maintain its current transformation matrix

		//console.log("Continuing...");
		/* Starting calculation of current transformation matrix */
		this.transfMx = mat4.create();

		if (interpolationAmount == 1) this.endedAnimation = true;  // checks if this is the last frame, and then updates the class state


		/**
		 * Interpolates the two values given, using the interpolationAmount calculated previously
		 * @param {Number} start the value that corresponds to the 'start' state
		 * @param {Number} end the value that corresponds to the 'end' state
		 */
		const interpolateValues = function (start, end) {
			return start + ((end - start) * interpolationAmount);
		}

		/**
		 * Calculates the current interpolation angle, receiving two rotation objects
		 * @param {Object} rotationObjStart The value that corresponds to the 'start' state. Object with 'angle' attribute
		 * @param {Object} rotationObjEnd The value that corresponds to the 'start' state. Object with 'angle' attribute
		 */
		const calculateCurrentAngle = function (rotationObjStart, rotationObjEnd) {
			const startAngle = rotationObjStart.angle;
			const endAngle = rotationObjEnd.angle;
			return interpolateValues(startAngle, endAngle);
		}

		// Calculates the current TRANSLATION matrix and multiplies it in the 'transfMx'
		if (this.startTrans.translation != undefined && this.endTrans.translation != undefined) {
			let out = vec3.create();
			vec3.lerp(out, [this.startTrans.translation.x, this.startTrans.translation.y, this.startTrans.translation.z], [this.endTrans.translation.x, this.endTrans.translation.y, this.endTrans.translation.z], interpolationAmount);
			mat4.translate(this.transfMx, this.transfMx, out);
		}
		// Calculates the current ROTATION X matrix and multiplies it in the 'transfMx'
		if (this.startTrans.rotationX != undefined && this.endTrans.rotationX != undefined) {
			const currentAngle = calculateCurrentAngle(this.startTrans.rotationX, this.endTrans.rotationX);
			mat4.rotate(this.transfMx, this.transfMx, currentAngle * DEGREE_TO_RAD, this.axisCoords[this.startTrans.rotationX.axis]);
		}
		// Calculates the current ROTATION Y matrix and multiplies it in the 'transfMx'
		if (this.startTrans.rotationY != undefined && this.endTrans.rotationY != undefined) {
			const currentAngle = calculateCurrentAngle(this.startTrans.rotationY, this.endTrans.rotationY);
			mat4.rotate(this.transfMx, this.transfMx, currentAngle * DEGREE_TO_RAD, this.axisCoords[this.startTrans.rotationY.axis]);
		}
		// Calculates the current ROTATION Z matrix and multiplies it in the 'transfMx'
		if (this.startTrans.rotationZ != undefined && this.endTrans.rotationZ != undefined) {
			const currentAngle = calculateCurrentAngle(this.startTrans.rotationZ, this.endTrans.rotationZ);
			mat4.rotate(this.transfMx, this.transfMx, currentAngle * DEGREE_TO_RAD, this.axisCoords[this.startTrans.rotationZ.axis]);
		}
		// Calculates the current SCALE matrix and multiplies it in the 'transfMx'
		if (this.startTrans.scale != undefined && this.endTrans.scale != undefined) {
			let out = vec3.create();
			vec3.lerp(out, [this.startTrans.scale.sx, this.startTrans.scale.sy, this.startTrans.scale.sx], [this.endTrans.scale.sx, this.endTrans.scale.sy, this.endTrans.scale.sz], interpolationAmount);
			mat4.scale(this.transfMx, this.transfMx, out);
		}

		if (this.endedAnimation) return true;
	}

	/**
	 * @method apply
	 * Applies the current transformation matrix to the scene
	 * @param {CGFscene} scene the scene object
	 * @return false if the object must not appear, true otherwise
	 */
	apply(scene) {
		if (this.transfMx == null) return false;   // the object doesn't appear
		else scene.multMatrix(this.transfMx);
		return true;
	}


}