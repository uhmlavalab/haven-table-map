

function getMarker(id) {
  let markers = _.filter(markerArray, m => m.markerId === id);
  return markers[0];
}

function getJob(jobName) {
  return jobs[`${jobName}`];
}

function getMax(corners) {
  return _.max(corners, corner => corner.y);
}

function getMin(corners) {
  return _.min(corners, corner => corner.y);
}

function getCenter(corners) {
  const max = getMax(corners);
  const min = getMin(corners);
  const x = (max.x + min.x) / 2;
  const y = (max.y + min.y) / 2
  return { 'x': x, 'y': y };
}

function getQuadrant(corner, center) {
  if ((corner.x - center.x) > 0) {
    if ((corner.y - center.y) > 0) {
      console.log(4);
      return 4;
    } else {
      console.log(1)
      return 1;
    }
  } else {
    if ((corner.y - center.y) > 0) {
      console.log(3);
      return 3;
    } else {
      console.log(2);
      return 2;
    }
  }
}

function getCurrentTime() {
  const d = new Date();
  return d.getTime();
}
