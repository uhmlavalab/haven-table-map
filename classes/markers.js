/* Represents an active Marker */
class MapMarker {

  constructor(id, name) {

    this.name = name;
    this.markerId = id; // ID number as defined by the Aruco library
    this.active = false; // Is this marker currently in play
    this.changed = false; // Was there a change in the position of this marker?
    this.job = null;

    /* Center x and y position of marker while active */
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.rotationSum = 0;
    this.direction = 'none';

    this.acitveCam = -1; // The camera that is designated to track the marker.
    /* Specific location of the corners while in active state */
    this.corners = [];
    this.maxTime = 300;
    this.timer = 0;

    this.rotationTimer = 0;
    this.maxRotationTime = 100;
    this.initializeCorners();
  }

  resetRotationTimer() {
    const d = new Date();
    this.rotationTimer = d.getTime();
  }

  checkRotationTimer() {
    const d = new Date();
    const curTime = d.getTime();
    if ((curTime - this.rotationTimer) > this.maxRotationTime) {
      return true;
    } else {
      return false;
    }
  }

  resetTimer() {
    const d = new Date();
    this.timer = d.getTime();
  }

  timesUp() {
    const d = new Date();
    const curTime = d.getTime();
    if ((curTime - this.timer) > this.maxTime) {
      return true;
    } else {
      return false;
    }
  }

  initializeCorners() {
    const emptyCorner = {
      x: 0,
      y: 0
    };
    for (let i = 0; i < 4; i++) {
      this.corners.push(emptyCorner);
    }
  }

  setJob(job) {
    this.job = job;
  }

  /**
   * Returns the current marker's Rotation
   */
  setRotation(rotation) {
    this.rotation = rotation;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  getRotationSum() {
    return this.rotationSum;
  }

  setRotationSum(rot) {
    this.rotationSum = rot;
  }

  getDirection() {
    return this.direction;
  }

  calcDirection() {
    let direction = 'none';

    let oldRotation = this.getRotation();
    let newRotation = this.calcRotation();

    let diff = oldRotation - newRotation;
    if (Math.abs(diff) < 2) {
      diff = 0;
    }
    this.setRotation(newRotation);

    if (Math.abs(diff) <= 100 && Math.abs(diff) > 0) {
      this.rotationSum += diff;
    } else {
      this.rotationSum = 0;
    }

    if (Math.abs(this.rotationSum) > this.job.getRotationMax()) {

      if (this.rotationSum < 0) {
        direction = 'left';
      } else if (this.rotationSum > 0) {
        direction = 'right';
      } else {
        direction = 'none';
      }
      this.rotationSum = 0;

    } else {
      this.direction = 'none';
      return;
    }


    this.direction = direction;
  }

  calcRotation() {
    let x = this.corners[0].x;
    let y = this.corners[0].y;

    let cX = this.getCenterX();
    let cY = this.getCenterY();

    let rotation = 0;

    rotation = Math.atan((cY - y) / (x - cX));

    /* If rotation is a negative number and x is positive, then we are dealing with Q4 */
    if (rotation < 0 && y > cY) {

      rotation = (2 * Math.PI + rotation);

    } else if (x < cX && y < cY) { // Q II

      if (rotation < 0) rotation = (rotation + Math.PI);
      else rotation = rotation + Math.PI / 2;

    } else if (x < cX && y > cY) { // Q III

      if (rotation < 0) rotation = (rotation + 3 * Math.PI / 2);
      else rotation = rotation + Math.PI;

    }
    rotation -= Math.PI * 2;
    // Rotation is reversed.  To calculate correct rotation
    return -convertRadiansToDegrees(rotation);
  }


  updateXY() {
    this.x = this.getCenterX();
    this.y = this.getCenterY();
  }



  /**
   * Gets the center X position of the marker.
   * @return x center.
   */
  getCenterX() {

    let corners = this.corners;
    return (corners[0].x + corners[2].x) * 0.5;

  }


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  getCenterY() {

    let corners = this.corners;
    return (corners[0].y + corners[2].y) * 0.5;

  }



  clearTracking() {
    //TODO: figure out what this is.
  }

  updateXY() {
    this.x = this.getCenterX();
    this.y = this.getCenterY();
  }

  /**
   * Sets the active came.  Called from the vivdeoElement.
   * @param id The Camera id.
   */
  setActiveCam(id) {
    this.activeCam = id;
  }

  /**
   * Gets the active cam.
   * @return The active cam.
   */
  getActiveCam() {
    return this.activeCam;
  }

  /**
   * Gets the center X position of the marker.
   * @return x center.
   */
  getCenterX() {

    let corners = this.corners;
    return (corners[0].x + corners[2].x) * 0.5;

  }

  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  getCenterY() {

    let corners = this.corners;
    return (corners[0].y + corners[2].y) * 0.5;

  }

  getRotation() {
    return this.rotation;
  }

  /**
   * Updates the status.  True, on the board, false not on the board.
   *
   * @param onOff Either true or false, switches the tag on or off
   */
  setActive(onOff) {
    this.active = onOff;
  };

  /** Returns marker active state */
  getActive() {
    return this.active;
  };

  /** Returns marker id number */
  getId() {
    return this.markerId;
  };

  /**
   * Updates the position of the marker on the map.  Does deep copy of the
   * corners from the aruco.js object to the marker object.
   * @param c Corners to update.
   */
  updatePosition(c) {
    /* Execute deep copy of the corners array */
    this.corners = Object.assign({}, c);
  };

  /**
   * Updates the position of the marker on the map.  Does deep copy of the
   * corners from the aruco.js object to the marker object.
   * @param c Corners to update.
   */
  updatePrevPosition(c) {
    /* Execute deep copy of the corners array */
    this.prevCorners = Object.assign({}, c);
  };

  /**
   * Resests the corner / position of the marker to 0.
   */
  clearPosition() {
    this.initializeCorners();
  }

  doMyJob() {
    if (this.job == null) {
      return;
    }
    this.job.myJob(this);
  }
}


/** This function updates the active state of the makers that have been declared*/
function resetMarkerData(m) {
    m.resetTimer();
    m.setActive(true);

}
