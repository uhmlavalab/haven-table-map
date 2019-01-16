/* This code runs the 3d interactive MAP built in LAVA Lab, UH MANOA
 * Coded by James Hutchison, 2018
 */

// Declare State Constatnts
const INTROMODE = 1;
const FULLSCREEN = 2;
const INITIALIZE = 0;

let markerArray = []; // Array holding all markers used in the operation of the map.
let videoArray = []; // Array holding video inputs.

let mainDisplay = null; // Map Object
let map = null;
let pieChart = null;
let lineChart = null;

// Aruco.js marker detector
let detector;


let layers = [];
// #7F3C8D,#11A579,#3969AC,#F2B701,#E73F74,#80BA5A,#E68310,#008695,#CF1C90,#f97b72,#4b4b8f,#A5AA99

let chartColors = {
  DGPV: '#E17C05',
  PV: '#EDAD08',
  Fossil: '#CC503E',
  Bio: '#73AF48',
  Battery: '#5F4690',
  Wind: '#38A6A5',
}

let mapLayerColors = {
  Solar: {
    fill: chartColors.DGPV,
    border: 'white',
  },
  Dod: {
    fill: '#6F4070',
    border: 'white',
  },
  Wind: {
    fill: chartColors.Wind,
    border: 'white',
  },
  Existing_RE: {
    fill: '#38A6A5',
    border: 'white',
  },
  Transmisison: {
    fill: 'transparent',
    border: '#ccff00',
  },
  Agriculture: {
    fill: '#0F8554',
    border: 'white',
  },
  Parks: {
    fill: '#994E95',
    border: 'white',
  },
}

/**
 * This method starts the map.  It is called when by the onload funciton
 */
function start() {

  setUp();
  initialize();
  startMap();

}

function startMap() {
  // Create detector object
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


  let loadMarkerArray = [1, 2, 10, 11, 12, 64, 192, 256, 384, 832];
  createAllMarkers(loadMarkerArray);

  mainDisplay = new MainDisplay(); // New map

  map = new Map('mapDiv', '../basemaps/oahu-satellite.png', 3613, 2794, 0.242);

  pieChart = new GenerationPie('pieChart', '../data/generation_revised.csv', 2020, chartColors);
  lineChart = new CapacityLine('lineChart', '../data/capacity_revised.csv', 2020, chartColors);

  map.addGeoJsonLayer('../layers/existing_re.json', 'existing_re', null, mapLayerColors.Existing_RE.fill, mapLayerColors.Existing_RE.border, 0.5);
  map.addGeoJsonLayer('../layers/dod.json', 'dod', null,  mapLayerColors.Dod.fill, mapLayerColors.Dod.border, 0.5);
  map.addGeoJsonLayer('../layers/parks.json', 'parks', null,  mapLayerColors.Parks.fill, mapLayerColors.Parks.border, 0.5);
  map.addGeoJsonLayer('../layers/transmission.json', 'transmission', null,  mapLayerColors.Transmisison.fill, mapLayerColors.Transmisison.border, 1.0 );
  map.addGeoJsonLayer('../layers/agriculture.json', 'agriculture', null,  mapLayerColors.Agriculture.fill, mapLayerColors.Agriculture.border, 0.5);

  map.addGeoJsonLayer('../layers/solar.json', 'solar', 2020,  mapLayerColors.Solar.fill, mapLayerColors.Solar.border, 0.2);
  map.addGeoJsonLayer('../layers/wind.json', 'wind', 2020,  mapLayerColors.Wind.fill, mapLayerColors.Wind.border, 0.2);


  setVW(); // Set Visual Width multiplier
  setVH(); // Set Visual Height multiplier

  updateWindowData(100 * VW, 100 * VH);
  buildVideoArray(2); // Set up the video inputs
  buildLayers();

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

    console.log(videoSources);
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


    navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);

    navigator.mediaDevices.getUserMedia(constraints2).
    then(gotStream2).catch(handleError);
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

  for (let i = 0; i < videoArray.length; i++) {

    if (videoArray[i].video.readyState === videoArray[i].video.HAVE_ENOUGH_DATA) {

      let imageData = snapshot(videoArray[i]);

      // Blow the pictures up to make them easier to identify the markers.
      imageData.width *= 4;
      imageData.height *= 4;
      let markers = detector.detect(imageData);
      videoArray[i].updateMarkers(markers);
      updateActiveMarkers(markers, videoArray[i].id); // Updates the active markers.
    }
  }

  if (mainDisplay.getState() !== INITIALIZE) {
    mainDisplay.runMap(markerArray);
  }

}

/**
 * Creates an image from the video feed so that the app can look for markers.
 */
function snapshot(vid) {

  vid.ctx.drawImage(vid.video, 0, 0, vid.canvas.width, vid.canvas.height);
  let imageData = vid.ctx.getImageData(0, 0, vid.canvas.width, vid.canvas.height);

  threshold = 100;

  /////  THRESHOLDING  ////////////////////////////////////
  var d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;


    vid.ctx.putImageData(imageData, 0, 0);

    return imageData;

  }

}

/** Update the Height and the Width of the display */
function updateWindowData(width, height) {

  mainDisplay.windowWidth = width;
  mainDisplay.windowHeight = height;

}


///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////// DRAWING / DISPLAY METHODS ///////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
let mod = 0; // Accounts for mirrored axis of image vs projector
let Ymod = 0;
let startRad = 75;

function track(m) {

  let e = document.getElementById("tracking-wrapper");
  e.style.left = m.x;
  e.style.top = m.y + 15 * VW;
}


function calcYear(m) {

  let rot = (360 - m.getRotation());
  let year = Math.trunc(rot / 12.3 + 2018);
  if (year === 2046) {
    year = 2045;
  }
  return year;

}

function changeScenario(scenario) {
  mainDisplay.setScenario(scenario);
}



function hideLayer() {
  map.hideLayer('dod');
  map.hideLayer('existing_re');
  map.hideLayer('parks');
  map.hideLayer('transmission');
  map.hideLayer('solar');
  map.hideLayer('agriculture');
}

function showLayer() {
  map.showLayer('dod');
  map.showLayer('existing_re');
  map.showLayer('parks');
  map.showLayer('transmission');
  map.showLayer('solar');
  map.showLayer('agriculture');
}

function updateSolarYear(year) {
  map.setSolarParcelsColor(year);
}

function convertRadiansToDegrees(angle) {
  return angle * 180 / Math.PI;
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


/** Takes and input in pixels are returns it in VW values
 * @param size -> size to convert
 * @return -> Converted value in VW */
function conertToVW(size) {
  return size / VW;
}


/** Takes and input in pixels are returns it in VH values
 * @param size -> size to convert
 * @return -> Converted value in VH */
function conertToVH(size) {
  return size / VH;
}

/* This loads the various layer objects into the layers array*/
function buildLayers() {

  layers.push(new SolarLayer());
  layers.push(new ExistingLayer());
  layers.push(new SeaLevelLayer());
  layers.push(new DODLayer());
  layers.push(new ParksLayer());
  layers.push(new TransmissionLayer());
  layers.push(new WindLayer());


}

/**
 * Populates the video array with n number of video input feeds.
 * @param n The number of video elements to create.
 */
function buildVideoArray(n) {

  videoArray.push(new VideoElement(0, 22, 50));
  videoArray.push(new VideoElement(1, 22, 25));

}

/*****************************************************************
 *******************START THE PROGRAM*****************************/
window.onload = start;
window.onresize = (() => {
  mainDisplay.resizeMap();
});
