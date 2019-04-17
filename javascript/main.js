/* This code runs the 3d interactive MAP built in LAVA Lab, UH MANOA
 * Coded by James Hutchison, 2018
 */

// Declare State Constants
const INITIALIZE = 0;
const INTROMODE = 1;
const FULLSCREEN = 2;
const WORK_FROM_HOME_MODE = 3;

let markerArray = []; // Array holding all markers used in the operation of the map.
let videoArray = []; // Array holding video inputs.
let configArray = [];

let map = null;
let pieChart = null;
let lineChart = null;
let barChart = null;
let mainDisplay = null;
let debugData = null;

// Aruco.js marker detector
let detector;
let jobs = null;

let subApp;

/**
 * This method starts the map.  It is called when by the onload funciton
 */

 /**
 @param island => 'Big Island' 'Oahu'
 */
function start(island) {
  setUp();
  initialize();
  startMap();
}

function startMap() {

  detector = new AR.Detector();
  requestAnimationFrame(tick);

}

/*Set Up the navigator
This function was part of the sample code downloaded with the Library
and I have not made any changes to the code. */
function setUp() {

  /* First step before running the program is to make certain that all of the markers
   *  that you wish to use are loaded into this array by ID number.  They will then be initialized
   *  for use.  If they are not in the array, they will not have functionality when the program is run.
   */
  let loadMarkerArray = [1, 2, 3, 4, 5, 6, 10, 11, 12, 64, 192, 256, 384, 832];
  createAllMarkers(loadMarkerArray);
  createAllJobs();
  const activeLayers = ['solar', 'wind', 'existing_re', 'parks', 'transmission', 'agriculture', 'ial', 'dod'];
  mainDisplay = new MainDisplay(); // New map
  map = new Map('mapDiv', '../basemaps/oahu-satellite.png', 3613, 2794, 0.237);
  pieChart = new GenerationPie('pieChart', '../data/generation.csv', 2020, chartColors);
  lineChart = new CapacityLine('lineChart', '../data/capacity.csv', 2020, chartColors);
  barChart = new BatteryBar('barChart', '../data/battery.csv', 2020, chartColors);

  setVW(); // Set Visual Width multiplier
  setVH(); // Set Visual Height multiplier

  updateWindowData(mainDisplay, 100 * VW, 90 * VH);
  buildVideoArray(2); // Set up the video inputs
  buildLayers(activeLayers, mainDisplay);
  showPieChart();
  const videoElement = videoArray[0].video;
  const videoElement2 = videoArray[1].video;

  navigator.mediaDevices.enumerateDevices()
    .then(gotDevices).then(getStream).catch(handleError);

  let videoSources = [];

  function gotDevices(deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'videoinput') {
        videoSources.push(deviceInfo.deviceId);
      } else {
        //  console.log('Found one other kind of source/device: ', deviceInfo);
      }
    }
  }

  function getStream() {
    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    var constraints = {
      audio: {
        //deviceId: {exact: audioSelect.value}
      },
      video: {
        deviceId: {
          exact: videoSources[0]
        }
      }
    };

    var constraints2 = {
      audio: {
        //deviceId: {exact: audioSelect.value}
      },
      video: {
        deviceId: {
          exact: videoSources[1]
        }
      }
    };

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);

    navigator.mediaDevices.getUserMedia(constraints2).then(gotStream2).catch(handleError);
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
  }

  function gotStream2(stream) {
    window.stream = stream; // make stream available to console
    videoElement2.srcObject = stream;
  }

  function handleError(error) {
    console.error('Error: ', error);
  }

}

/* Detects the Markers and makes the changes in the program */
function tick() {
  requestAnimationFrame(tick);
  if (!(mainDisplay.isDebug())) {
    _.each(videoArray, videoFeed => {
      if (videoFeed.video.readyState === videoFeed.video.HAVE_ENOUGH_DATA) {
        let imageData = snapshot(videoFeed);

        if (videoFeed.id === 1 && mainDisplay.checkAddTimer() || videoFeed.id === 0) {
          let markers = detector.detect(imageData);
          if (markers.length > 0) {
            if (mainDisplay.getState() === INITIALIZE) {

              _.map(markers, m => {
                if (!(_.contains(configArray, m.id))) {
                  configArray.push(m.id);
                }
              });

              console.log(configArray);
            };
            if (!(mainDisplay.getState() === INITIALIZE)) {
              videoFeed.updateMarkers(markers);
              mainDisplay.updateLiveMarkers();
            }
          }
        }
      }
    });

    if (mainDisplay.getState() !== INITIALIZE) {
      updateMarkerData(mainDisplay.liveMarkers);
    }
  }

}

/**
 * Creates an image from the video feed so that the app can look for markers.
 */
function snapshot(vid) {
  vid.ctx.drawImage(vid.video, 0, 0, vid.canvas.width, vid.canvas.height);
  return vid.ctx.getImageData(0, 0, vid.canvas.width, vid.canvas.height);
}

/** Update the Height and the Width of the display */
function updateWindowData(mainDisplay, width, height) {
  mainDisplay.windowWidth = width;
  mainDisplay.windowHeight = height;
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////// DRAWING / DISPLAY METHODS ///////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function convertRadiansToDegrees(angle) {
  return angle * 180 / Math.PI;
}

/** Takes and input in pixels are returns it in VW values
 * @param size -> size to convert
 * @return -> Converted value in VW */
function conertToVW(size) {
  return size / VW;
}

/** Takes and input in pixels are returns it in VH values
 * @param size -> size to convert
 * @return -> Converted value in VH */
function convertToVH(size) {
  return size / VH;
}

let VW, VH; // WIDTH AND HEIGHT VARIABLES

/******************************************************
 *********
 ***  VISUAL WIDTH AND VISUAL HEIGHT FUNCTIONS
 *********
 ******************************************************/

/** The map is broken down into VW and VH
 * Visual width and visual height.  It works just like css
 * where there are 100 units in each direciton. */
function setVW() {
  VW = window.innerWidth / 100;
}

function setVH() {
  VH = window.innerHeight / 100;
}

function toggleCams() {
  const cam1 = getElement("canvas1-wrapper");
  const cam2 = getElement("canvas3-wrapper");
  (videosVisible) ? hideGroup([cam1, cam2]): showGroup([cam1, cam2]);
  videosVisible = !videosVisible;
}

/*****************************************************************
 *******************START THE PROGRAM*****************************/
function subscribeToStartApp(island, extraScreen) {

   if (extraScreen) {
     subApp = window.open('subApplication/index.html', 'subApp');
   }
   start(island);
}
window.onresize = (() => {
  mainDisplay.resizeMap();
});
