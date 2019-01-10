
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

constructor(id, w, h){
  this.id = id;
  this.canvas;
  this.video;
  this.w = w;
  this.h = h;

  this.activeMarkers = []; // Which markers are in the camera's view.

  /* The dy and dy are the adjustment from center that is calculated when
   * calibrating the markers.  */
  this.dy = 0;
  this.dx = 0

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
  /**
   * Stores object for all markers that are in the camera's view.
   * @param markers Marker objects from aruco.js
   */
  updateMarkers(markers) {

    // Empty marker Array
    this.activeMarkers = [];

    // Now fill the array with markers in view
    for (let m of markerArray) {

      for (let mCurrent of markers) {

        if (m.markerId === mCurrent.id) {
          this.activeMarkers.push(m);

          m.setActiveCam(this.id);

        } else if (m.countdown === 0) {
          m.clearTracking();
        }
      }
    }
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
