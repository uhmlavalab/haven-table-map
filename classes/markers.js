/* Represents an active Marker */
class MapMarker {

  constructor(id) {
    this.markerId = id; // ID number as defined by the Aruco library
    this.active = false; // Is this marker currently in play?
    this.layerActive = false;
    // Initally set to false when markers are created.

    /* Center x and y position of marker while active */
    this.x = 0;
    this.y = 0;
    this.rotation = 0;

    this.countdown = 0; // Each marker has a timer that counts down from the
    // moment it is detected on the map to prevent flickering
    // from poor detection.
    this.trackColor = "rgba(226, 13, 31, 0.8)";
    this.displaying;
    this.initialY;
    this.acitveCam = -1; // The camera that is designated to track the marker.
    this.trackCountDown = 0;
    this.currentRotation = 0;


    /* Specific location of the corners while in active state */
    this.corners = [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }];
  }

  /**
   * Returns the current marker's Rotation
   */
  setRotation() {
    let found = false;
    let v = videoArray[0];

    for (let m of v.activeMarkers) {
      if (this.markerId === m.markerId) {
        found = true;
      }
    }

    if (!found)
      return;

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
    this.rotation = -convertRadiansToDegrees(rotation);
  };

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
  };


  /**
   * Gets the active cam.
   * @return The active cam.
   */
  getActiveCam() {
    return this.activeCam;
  };


  /**
   * Gets the center X position of the marker.
   * @return x center.
   */
  getCenterX() {

    let corners = this.corners;
    return (corners[0].x + corners[2].x) * 0.5;

  };


  /**
   * Gets the center Y position of the marker.
   * @return y center.
   */
  getCenterY() {

    let corners = this.corners;
    return (corners[0].y + corners[2].y) * 0.5;

  };

  getRotation() {
    return this.rotation;
  }
  /***********
   ****
   ** Countdown methods
   ****
   ***********/
  resetCountdown() {
    this.countdown = 120;
  };

  decrementCountdown() {
    this.countdown--;
  };

  getCountDown() {
    return this.countdown;
  };

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

  setInitialY(y) {
    this.initialY = y;
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
   * Resests the corner / position of the marker to 0.
   */
  clearPosition() {
    /* Specific location of the corners while in active state */
    this.corners = [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }];
  };
}

/* This function is called during setup of the Map.  Before it begins, all markers
 * that are used, or can be used during operation are loaded into an array that is
 * publically accessable
 *
 * loadMarkerIds = array holding all markers that will be used during the map operation
 *
 */
function createAllMarkers(loadMarkerIds) {
  for (let m of loadMarkerIds) {
    markerArray.push(new MapMarker(m));
  }
}

function updateMarkerActive() {
  clearMarkerActive();

  for (let m of markers) {
    for (let m1 of markerArray) {
      if (m.id === m1.markerId) {
        m1.setActive(true);
      }
    }
  }
}

function clearMarkerActive() {
  for (let m of markerArray) {
    m.setActive(false);
  }
}

/**
 * Each marker has a specific function and this function is called based on
 * the id o the marker.
 *
 * @param m The marker who's function is to be executed.
 */
function executeMarkerFunction(m) {

  let id = m.getId();

  switch (id) {

    case 1:
      if (mainDisplay.state === INTROMODE) {
        mainDisplay.setState(FULLSCREEN);
        mainDisplay.goFullscreen();

      } else if (mainDisplay.state === FULLSCREEN) {
        //m.track();
        m.setRotation();

        mainDisplay.setCurYear(calcYear(m));

      }
      break;

    case 4:
      m.setRotation();
      mainDisplay.updateAddRemove(m);
      break;

    case 10:
      m.setRotation();
      mainDisplay.selectScenario(m);
      break;

    case 2:
      m.setRotation();
      mainDisplay.toggleChart(m);
      break;

  }
}

/** This function updates the active state of the makers that have been declared
 *   as in use.
 *   @param markers The array of recently detected markers
 */
function updateActiveMarkers(markers, vidId) {
  for (let m of markers) {

    for (let mar of markerArray) {

      if (m.id === mar.markerId) {

        if (m.id === 1) {
          mainDisplay.yearRotation = mar.getRotation();
        }
        mar.setActive(true);
        mar.resetCountdown(); // Marker is located.  Start timer.

        // Check to see if the marker is being tracked by other cam.
        if (mar.getActiveCam() === vidId) {
          mar.updatePosition(m.corners); // Update the position of the marker.
        }
      }
    }
  }

  for (let m of markerArray) {
    if (!m.getActive()) {
      m.clearPosition();
    }
  }
}
