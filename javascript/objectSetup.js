
/* This function is called during setup of the Map.  Before it begins, all markers
 * that are used, or can be used during operation are loaded into an array that is
 * publically accessable
 *
 * loadMarkerIds = array holding all markers that will be used during the map operation
 *
 */
function createAllMarkers(loadMarkerIds) {
  //TODO: set up defaults to be loaded
  for (let m of loadMarkerIds) {
    markerArray.push(new MapMarker(m));
  }
}

/* This loads the various layer objects into the layers array*/
function buildLayers(activeLayers, mainDisplay) {
  let layersToBuild = [];
  _.each(activeLayers, layerName => layersToBuild.push(_.filter(layerData, layer => layer.name === layerName)));
  _.map(layersToBuild, element => mainDisplay.layers.push(new Layer(element[0])));
}

/**
 * Populates the video array with n number of video input feeds.
 * @param n The number of video elements to create.
 */
function buildVideoArray(n) {
  videoArray.push(new VideoElement(0, 22, 50));
  videoArray.push(new VideoElement(1, 22, 25));
}
