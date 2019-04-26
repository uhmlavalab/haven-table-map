let videoArray = []; // Array holding video inputs.
let videoLoop = true;
let activeElement = '';

function start() {

  let markerArray = [{
      name: 'Year',
      markerId: 3,
      icon: 'images/icons/hourglass.png'
    }, {
      name: 'Layer',
      markerId: 4,
      icon: 'images/icons/layers-01.png'
    },
    {
      name: 'Chart',
      markerId: 5,
      icon: 'images/icons/pie-01.png'
    },
    {
      name: 'Scenario',
      markerId: 6,
      icon: 'images/icons/scenario-01.png'
    }
  ];

  let layerArray = [{
      name: 'Solar',
      tag: 'solar',
      icon: `images/icons/solar-icon.png`,
      active: true
    },
    {
      name: 'Wind',
      tag: 'wind',
      icon: `images/icons/wind-icon.png`,
      active: true
    },
    {
      name: 'Transmission Lines',
      tag: 'transmission',
      icon: `images/icons/transmission-icon.png`,
      active: true
    },
    {
      name: 'Parks',
      tag: 'parks',
      icon: `images/icons/parks-icon.png`,
      active: true
    },
    {
      name: 'DOD lands',
      tag: 'dod',
      icon: `images/icons/dod-icon.png`,
      active: true
    },
    {
      name: 'Ag Lands',
      tag: 'agriculture',
      icon: `images/icons/agriculture-icon.png`,
      active: true
    },
    {
      name: 'IAL',
      tag: 'ial',
      icon: `images/icons/ial-icon.png`,
      active: true
    },
    {
      name: 'Existing Renewables',
      tag: 'existing_re',
      icon: `images/icons/existing_re-icon.png`,
      active: true
    }
  ];

  const islandArray = [{
      name: 'Oahu',
      id: 'oahu',
    },
    {
      name: 'Big Island',
      id: 'bigisland',
    },
    {
      name: 'Maui',
      id: 'maui',
    }
  ];

  runTitleAnimation();
  populateSidebar();
  populateSelectCards(islandArray);
  populateSetupCams();
  populateSetupMarkers(markerArray);
  populateSetupLayers(layerArray);
  addThirdScreenSelector();

}

function populateSetupLayers(layerArray) {
  const setupLayersWrapper = getElement('setup-layers-wrapper');
  for (let layer of layerArray) {
    createLayerCard(layer.name, layer.tag, layer.icon, layer.active, layer);
  }

  function createLayerCard(name, tag, icon, active, layer) {
    const card = createElement('div', 'layer-card-wrapper', `layer-card-${name}`, setupLayersWrapper);
    const image = createElement('img', 'layer-card-image', `layer-card-image-${name}`, card);
    const title = createElement('p', 'layer-card-text', `layer-card-text-${name}`, card);
    setText(title, name);

    image.src = icon;

    card.style.backgroundColor = active ? 'rgba(130,145,188, 0.7)' : ' rgba(78, 67, 71, 0.7)';

    const changeLayerButton = createElement('div', 'sidebar-button', `change-layer-button-${name}`, card);
    changeLayerButton.addEventListener('click', () => {
      layer.active = !layer.active;
      card.style.backgroundColor = layer.active ? 'rgba(130,145,188, 0.7)' : ' rgba(78, 67, 71, 0.7)';
      setText(changeLayerButton, layer.active ? 'Disable Layer' : 'Enable Layer');
    });

    setText(changeLayerButton, layer.active ? 'Disable Layer' : 'Enable Layer');

  }
}

function populateSetupMarkers(markerArray) {
  const setupMarkersWrapper = getElement('setup-markers-wrapper');
  for (let marker of markerArray) {
    createMarkerCard(marker.name, marker.markerId, marker.icon);
  }

  function createMarkerCard(name, id, icon) {
    const card = createElement('div', 'marker-card-wrapper', `marker-card-${name}`, setupMarkersWrapper);
    const image = createElement('img', 'marker-card-image', `marker-card-image-${name}`, card);
    image.src = icon;
    const leftSide = createElement('div', 'marker-card-wrapper-left', `marker-card-left-${name}`, card);
    let markerTitle = createElement('p', 'marker-title', `marker-card-title-${name}`, leftSide);
    setText(markerTitle, `Marker: ${name} Selector`);
    let markerText = createElement('p', 'marker-title', `marker-card-id-${name}`, leftSide);
    setText(markerText, `Marker Id: ${id}`);

    const changeMarkerButton = createElement('div', 'sidebar-button', `change-marker-button-${name}`, leftSide);
    setText(changeMarkerButton, 'Change Marker');
  }
}

function populateSetupCams() {
  const setupCamsWrapper = getElement('setup-cams-wrapper');
  const addRemoveCamWrapper = createElement('div', 'cam-wrapper', 'add-remove-cam-wrapper', setupCamsWrapper);
  const mainCamWrapper = createElement('div', 'cam-wrapper', 'main-cam-wrapper', setupCamsWrapper);
  const addRemoveTitle = createElement('p', 'cam-title', 'add-remove-cam-title', addRemoveCamWrapper);
  setText(addRemoveTitle, 'Add Remove Camera');
  const mainTitle = createElement('p', 'cam-title', 'main-cam-title', mainCamWrapper);
  setText(mainTitle, 'Main Camera');
}

function populateSidebar() {

  const sidebarWrapper = getElement('sidebar-wrapper');
  const mainButtonsWrapper = createElement('div', 'main-buttons-wrapper', 'main-buttons-wrapper', sidebarWrapper);
  const secondaryButtonsWrapper = createElement('div', 'main-buttons-wrapper', 'secondary-buttons-wrapper', sidebarWrapper);
  const setupCamsButton = createElement('div', 'sidebar-button', 'setup-cam-button', mainButtonsWrapper);
  setText(setupCamsButton, 'Setup Cameras');

  setupCamsButton.addEventListener('click', () => {
    activeElement = 'setup-cams-wrapper';
    slideRight('select-wrapper');
    slideLeft(activeElement);
    setOpacity(getElement('main-buttons-wrapper'), 0);
    showElement(secondaryButtonsWrapper, 1);
    populateVideoFeeds();
    createVideoFeeds();
    setTimeout(runVideos, 500);
  });

  const setupMarkersButton = createElement('div', 'sidebar-button', 'setup-markers-button', mainButtonsWrapper);
  setText(setupMarkersButton, 'Setup Markers');

  setupMarkersButton.addEventListener('click', () => {
    activeElement = 'setup-markers-wrapper';
    slideRight('select-wrapper');
    slideLeft(activeElement);
    setOpacity(getElement('main-buttons-wrapper'), 0);
    showElement(secondaryButtonsWrapper, 1);
  });

  const setupLayersButton = createElement('div', 'sidebar-button', 'setup-layers-button', mainButtonsWrapper);
  setText(setupLayersButton, 'Setup Layers');

  setupLayersButton.addEventListener('click', () => {
    activeElement = 'setup-layers-wrapper';
    slideRight('select-wrapper');
    slideLeft(activeElement);
    setOpacity(getElement('main-buttons-wrapper'), 0);
    showElement(secondaryButtonsWrapper, 1);
  });

  const calibrateSurfaceButton = createElement('div', 'sidebar-button', 'calibrate-button', mainButtonsWrapper);
  setText(calibrateSurfaceButton, 'Calibrate Surface');

  const backButton = createElement('div', 'sidebar-button', 'back-button', secondaryButtonsWrapper);
  hideElement(secondaryButtonsWrapper);
  setText(backButton, 'Back');

  backButton.addEventListener('click', () => {
    slideRight(activeElement);
    slideLeft('select-wrapper');
    setOpacity(getElement('main-buttons-wrapper'), 1);
    hideElement(secondaryButtonsWrapper, 1);
  });

  const debugModeButton = createElement('div', 'sidebar-button', 'debug-button', mainButtonsWrapper);
  setText(debugModeButton, 'Debug Mode');

}

function populateVideoFeeds() {
  const camWrapperA = createElement('div', 'cam-feed', 'cam-feed-A', getElement('add-remove-cam-wrapper'));
  const videoA = createElement('video', 'cam-video-actual', 'video-2', camWrapperA);;
  videoA.autoplay = 'true';
  const canvasA = createElement('canvas', 'video-canvas', 'canvas3', camWrapperA);
  videoA.style.width = 100 + '%';
  const camWrapperB = createElement('div', 'cam-feed', 'cam-feed-B', getElement('main-cam-wrapper'));
  const videoB = createElement('video', 'cam-video-actual', 'video', camWrapperB);
  videoB.autoplay = 'true';
  const canvasB = createElement('canvas', 'video-canvas', 'canvas', camWrapperB);
  videoB.style.width = 100 + '%';

}

function runVideos() {

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
        console.log('Found one other kind of source/device: ', deviceInfo);
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
  tick();
}

/* Detects the Markers and makes the changes in the program */
function tick() {
  if (!videoLoop) {
    return;
  }
  requestAnimationFrame(tick);
}

/**
 * Creates an image from the video feed so that the app can look for markers.
 */
function snapshot(vid) {
  vid.ctx.drawImage(vid.video, 0, 0, vid.canvas.width, vid.canvas.height);
  return vid.ctx.getImageData(0, 0, vid.canvas.width, vid.canvas.height);
}

function createVideoFeeds() {
  buildVideoArray(2);
}

function slideRight(elementId) {
  getElement(elementId).style.left = 120 + '%';
}

function slideLeft(elementId) {
  getElement(elementId).style.left = 22 + '%';
}

function addThirdScreenSelector() {
  const selectorWrapper = getElement('select-third-screen');
  const checkbox = createElement('input', 'select-third-screen-checkbox', 'select-third-screen-checkbox', selectorWrapper);
  checkbox.type = "checkbox";

  const label = createElement('label', 'checkbox-label', 'checkbox-label', selectorWrapper);
  setText(label, "Include Second Screen");
}

function populateSelectCards(islandArray) {
  const selectWrapper = getElement('select-wrapper');
  for (let island of islandArray) {
    let card = createElement('div', 'select-card', `select-card-${island.id}`, selectWrapper);
    let cardImg = createElement('img', 'select-card-image', `select-card-image-${island.id}`, card);
    let titleWrapper = createElement('div', 'select-card-title', `select-card-title-${island.id}`, card);
    setText(titleWrapper, island.name);
    setImgSrc(cardImg, `images/landing-images/${island.id}.jpg`);

    let startButton = createElement('div', 'start-application-button', `start-button-${island.id}`, card);
    setText(startButton, 'Start Haven');


    card.addEventListener('mouseover', () => {
      card.style.backgroundColor = 'rgba(0,0,0,0)';
      titleWrapper.style.backgroundColor = 'rgba(85,60,79,0.8)';
      titleWrapper.style.height = `${57}%`;
      setOpacity(startButton, 1);
    });

    card.addEventListener('mouseout', () => {
      card.style.backgroundColor = 'rgba(0,0,0,0.5)';
      titleWrapper.style.backgroundColor = 'rgba(85,60,79,0.5)';
      titleWrapper.style.height = `${15}%`;
      setOpacity(startButton, 0);
    });

    startButton.addEventListener('click', () => {
      const mainAppWindow = window.open('application.html', 'mainAppWindow');
      videoLoop = false;
      setTimeout(() => {
        mainAppWindow.subscribeToStartApp(island, getElement('select-third-screen-checkbox').checked);
      }, 400);
    });
  }
}


function runProgram() {
  const mainApp = window.open('application.html', 'mainApp');
}

function runTitleAnimation() {

  createTitleText();

  function createTitleText() {
    const titleText = 'ProjecTABLE';
    let textArray = [];
    const titleContainer = getElement('title-wrapper');
    for (let i = 0; i < titleText.length; i++) {
      let letter = createElement('div', 'title-letter', `titleLetter-${i}`, titleContainer);
      setText(letter, titleText[i]);
      textArray.push(letter);
    }
    recursiveAnimate(textArray, 0);
    setInterval(() => {
      recursiveAnimate(textArray, 0);
    }, 10000);
  }

  function recursiveAnimate(textArray, index) {
    if (index >= textArray.length) {
      return;
    }
    setFontSize(textArray[index], 50 + 'px');
    setTimeout(() => {
      setFontSize(textArray[index], 40 + 'px');
      recursiveAnimate(textArray, index + 1);
    }, 100);
  }

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

onload = start;
