/**
 * Abstract Class Animation.
 *
 * @class Animation
 */
class Animation {

    constructor(startTime, endTime, startTrans, endTrans) {
      if (this.constructor == Animation) {
        throw new Error("Abstract classes can't be instantiated.");
      }

      this.startTime = startTime;
      this.endTime = endTime;
      this.startTrans = startTrans;
      this.endTrans = endTrans;

      this.active = false;
      this.lastTime = startTime;
      this.currentState = vec3();
    }

    update(currentTime) {
        if (!this.active)
            return;

        //Calculate elapsed time
        this.elapsedTime = currentTime - this.startTime;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        //Update transformations
        if (currentTime < this.endTime){

        }

    }

    apply() {

    }


}