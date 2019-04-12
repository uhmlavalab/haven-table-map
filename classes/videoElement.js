///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////VIDEO ELEMENT OBJECTS ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
let videosVisible = false; // Videos are visible only in debug mode.

/**
 * This file represents the video input elements.
 * @param id The ID tag of the video input.
 * @param w The width of the canvas.
 * @param h The height of the canvas.
 */
class VideoElement {

  constructor(id, w, h) {
    this.id = id;
    this.canvas;
    this.video;
    this.w = w;
    this.h = h;
    this.addRemoveElement = false;
    this.addRemoveTimer = 0;
    this.addRemoveTimerMax = 5000;

    this.activeMarkers = []; // Which markers are in the camera's view.

    // Each video element has its own canvas that is hidden from view by default

    switch (id) {

      case 0:
        this.canvas = document.getElementById("canvas");
        this.video = document.getElementById("video");
        break;

      case 1:
        this.canvas = document.getElementById("canvas3");
        this.video = document.getElementById("video-2");
        break;

    }

    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = w * VW;
    this.canvas.height = h * VH;

    this.threshold = 120;

  }

  minimizeCam() {
    this.setWidth(0);
    this.setHeight(0);
  }

  restoreCam() {
    this.setWidth(this.w);
    this.setHeight(this.h);
  }

  resetTimer() {
    this.addRemoveTimer = getCurrentTime();
  }

  checkTimer() {

    if ((getCurrentTime() - this.addRemoveTimer) > this.addRemoveTimerMax) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Stores object for all markers that are in the camera's view.
   * @param markers Marker objects from aruco.js
   */
  updateMarkers(markers) {
    const newMarkers = [];
    _.map(markers, marker => {
      let markerFound = _.find(markerArray, m => marker.id === m.markerId);
      newMarkers.push(markerFound);
      if (!(mainDisplay.getState() === INITIALIZE)) {
      if(markerFound.getActive() && this.id === 0) {
        markerFound.updatePosition(marker.corners);
      }
    }
      if (this.id === 1 && mainDisplay.getState() === FULLSCREEN) {
        if (mainDisplay.checkAddTimer()) {
          mainDisplay.addRemoveNextLayer();
        }
      }
    });

    _.each(newMarkers, m => resetMarkerData(m));
    this.activeMarkers = _.union(newMarkers, this.activeMarkers);
    _.each(this.activeMarkers, m => {
      if (m.timesUp()) {
        m.setActive(false);
        this.activeMarkers.slice(this.activeMarkers.indexOf(m));
      }
    });
    this.activeMarkers = _.filter(this.activeMarkers, m => m.getActive());
  };

  /**
   * Sets the width of the canvas.
   * @param w The new width to set.
   */
  setWidth(w) {
    this.canvas.width = w;
  };

  /**
   * Sets the height of the canvas.
   * @param h The new height to set.
   */
  setHeight(h) {
    this.canvas.height = h;
  };

  /**
   * Gets the width of the canvas.
   * @return the width.
   */
  getWidth() {
    return this.w;
  };

  /**
   * Gets the height of the canvas.
   * @return The height.
   */
  getHeight() {
    return this.h;
  };

  /**
   * Sets the dy tracking adjustment
   * @param dy The y adjustment.
   */
  setDY(dy) {
    this.dy = dy;
  };

  /**
   * Sets the dx tracking adjustment
   * @param dx The x adjustment.
   */
  setDX(dx) {
    this.dx = dx;
  };

  /**
   * Gets the dy adjustment.
   * @return The dy adjustment.
   */
  getDY() {
    return this.dy;
  };

  /**
   * Gets the dx adjustment.
   * @return the dx adjustment.
   */
  getDX() {
    return this.dx;
  };

}
