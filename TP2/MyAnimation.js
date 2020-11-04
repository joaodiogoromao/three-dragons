/**
 * Abstract Class MyAnimation.
 *
 * @class MyAnimation
 */
class MyAnimation {

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
    }

    setAnimationVariables(start, end) {
      this.startTime = start.instant;
      this.endTime = end.instant;
      this.startTrans = start.transf;
      this.endTrans = end.transf;
      console.log("Setting animation variables!!!");
    }

    update(currentTime) {
      console.log("Animation update");
      if (currentTime < this.startTime) return; // animation hasn't started yet
      if (currentTime > this.endTime) return; // animation has finished
      const elapsedTime = currentTime-this.startTime;
      console.log("Elapsed time: " + elapsedTime + ", start time: " + this.startTime + ", end time: " + this.endTime)
      this.transfMx = mat4.create();

      const interpolationAmount = (function () {
        return elapsedTime/(this.endTime-this.startTime);
      }).bind(this);

      const interpolateValues = function(start, end) {
        return start + ((end-start)*(interpolationAmount()));
      }

      const calculateCurrentAngle = function(rotationObjStart, rotationObjEnd) {
        const startAngle = rotationObjStart.angle;
        const endAngle = rotationObjEnd.angle;
        console.log("Start angle: " + startAngle + ", end Angle: " + endAngle);
        return interpolateValues(startAngle, endAngle);
      }

      if (this.startTrans.translation != undefined && this.endTrans.translation != undefined) {
        let out = vec3.create();
        vec3.lerp(out, [this.startTrans.translation.x, this.startTrans.translation.y, this.startTrans.translation.x], [this.endTrans.translation.x, this.endTrans.translation.y, this.endTrans.translation.z], interpolationAmount());
        mat4.translate(this.transfMx, this.transfMx, out);
      }
      if (this.startTrans.rotationX != undefined && this.endTrans.rotationX != undefined) {
        const currentAngle = calculateCurrentAngle(this.startTrans.rotationX, this.endTrans.rotationX);
        console.log("Current Angle: "+currentAngle);
        mat4.rotate(this.transfMx, this.transfMx, currentAngle*DEGREE_TO_RAD, this.axisCoords[this.startTrans.rotationX.axis]);
      }
      if (this.startTrans.rotationY != undefined && this.endTrans.rotationY != undefined) {
        const currentAngle = calculateCurrentAngle(this.startTrans.rotationY, this.endTrans.rotationY);
        mat4.rotate(this.transfMx, this.transfMx, currentAngle*DEGREE_TO_RAD, this.axisCoords[this.startTrans.rotationY.axis]);
      }
      if (this.startTrans.rotationZ != undefined && this.endTrans.rotationZ != undefined) {
        const currentAngle = calculateCurrentAngle(this.startTrans.rotationZ, this.endTrans.rotationZ);
        mat4.rotate(this.transfMx, this.transfMx, currentAngle*DEGREE_TO_RAD, this.axisCoords[this.startTrans.rotationZ.axis]);
      }
      if (this.startTrans.scale != undefined && this.endTrans.scale != undefined) {
        let out = vec3.create();
        vec3.lerp(out, [this.startTrans.scale.sx, this.startTrans.scale.sy, this.startTrans.scale.sx], [this.endTrans.scale.sx, this.endTrans.scale.sy, this.endTrans.scale.sz], interpolationAmount());
        mat4.scale(this.transfMx, this.transfMx, out);
      }

    }

    apply(scene) {
      if (this.transfMx == null) return false;
      else scene.multMatrix(this.transfMx);
      return true;
    }


}