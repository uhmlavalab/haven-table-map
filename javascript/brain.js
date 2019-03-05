function updateMarkerData(liveMarkers) {

  if (liveMarkers.length > 0) {
    if (videoArray[1].addRemoveElement & videoArray[1].checkTimer()) {
      mainDisplay.addRemoveNextLayer();
      videoArray[1].resetTimer();
    }

    compareMarkerData();
  }

  function compareMarkerData() {
    let changedMarkers = [];
    let rotatedMarkers = []

    //TODO: Check the test corner to see if any markers have rotated.
    _.map(liveMarkers, marker => {

      if (mainDisplay.getState(INTROMODE)) {
        mainDisplay.goFullscreen();
      }

      if (marker.checkRotationTimer()) {
        marker.calcDirection();
        if (marker.getDirection !== 'none') {
          marker.doMyJob();
        }
        marker.resetRotationTimer();
      }
    });
  }
}
