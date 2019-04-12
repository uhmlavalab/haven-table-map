function initialize() {
  const initializeWrapper = createContainer(); // Div holding the initialize data
  const loadWrap = buildLoadingWrapper();
  const loadWrapTitle = buildLoadWrapTitle();
  const startButton = createStartButton();
  const rotateFn = buildIntro();
  const camWrap = buildCamWrap();
  const cam1 = buildCam1();
  const cam2 = buildCam2();
  const rightSideWrapper = createRightSideContainer();
  const setupDetailsWrapper = createSetupDetailsWrapper();
  const setupDetailsTitle = createSetupDetailsTitle();
  let assignedJobs = [];
  let numLayers = 0;
  const cardsBuilt = [];

  /** Creates the Right side Container HTML Element.  This holds the
   *  Buttons and instructions.  It is initially set to camera setup
   */
  function createRightSideContainer() {
    let rightSideWrapper = createElement('p', 'cam-text', 'cam-id', camWrap);
    setText(rightSideWrapper, 'Camera Setup <br/><br/> Align the Cameras with the rectangles.');
    return rightSideWrapper;
  }

  /** Creates the container that holds the data for the initialization application.
   *  It is appended to the lower section wrapper.
   */
  function createContainer() {
    const initializeContainer = createElement('div', 'initialize-wrapper', 'initialize-wrapper', getElement('lower-section-wrapper'));
    showElement(initializeContainer);
    return initializeContainer;
  }

  /** Creates the intro animations.  The dots and the rotating text */
  function buildIntro() {
    animateDots(loadWrap);

    let i = 0;
    let rotateFn = setInterval(rotate, 5);

    function rotate() {
      loadWrapTitle.style.transform = `rotateY(${i}deg)`;
      i += 0.5;
    }

    setTimeout(clearInterval(rotate), 7000);
    startButton.addEventListener("click", startSetup);
    setTimeout(hideLoader, 7000);

    return rotateFn;
  }

  /** Stops the animation and show the start button */
  function hideLoader() {
    hideElement(document.getElementById("loader"));
    loadWrapTitle.style.transform = `rotateY(0deg)`;
    showElement(getElement('start-button-wrapper'));
  }

  /** After the user clicks start.  This function begins the setup.  A sound
   * is played and teh cameras are shown.
   */
  function startSetup() {
    mainDisplay.loadSound.play();
    removeChild(loadWrap, getElement('start-button-wrapper'));
    removeChild(initializeWrapper, loadWrap);
    //config();
    setTimeout(function () {
      showElement(camWrap);
      toggleCams();
      setupCams();
    }, 100);

  }

  /** Creates the wrapper that holds the web cam displays */
  function buildCamWrap() {
    let elem = getElement('webcam-wrapper');
    hideElement(elem);
    return elem;
  }

  /** Creates the element that shows a video feed */
  function buildCam1() {
    return getElement('canvas1-wrapper');
  }

  /** Creates the element that shows a video feed */
  function buildCam2() {
    return getElement('canvas3-wrapper');
  }

  /** Updates the web page to show the outlines on the map for where to aim the cameras */
  function setupCams() {

    let camDoneBut = createElement('div', 'initialize-button', 'initialize-button', rightSideWrapper);
    let camDoneButTxt = createElement('p', 'initialize-button-text', 'initialize-button-text', camDoneBut);
    setText(camDoneButTxt, 'Continue');

    // Draw the overlay rectangles
    const cam1Overlay = createElement('div', 'cam', 'cam-1-overlay', camWrap);
    const cam2Overlay = createElement('div', 'cam', 'cam-2-overlay', camWrap);
    updateElementStyle(cam1Overlay, [{ 'height': 49 + 'vh' }, { 'width': 22 + 'vw' }, { 'zIndex': 3 },
      { 'border': '5px solid orange' }, { 'top': 50 + 'vh' }, { 'position': 'absolute' }]);
    updateElementStyle(cam2Overlay, [{ 'height': 30 + 'vh' }, { 'width': 22 + 'vw' }, { 'zIndex': 3 },
      { 'border': '5px solid red' }, { 'top': 2 + 'vh' }, { 'position': 'absolute' }]);

    camDoneBut.addEventListener('click', initializeLayers);
  }

  /** Creates html element for the cards holding the layer data during layer configuration */
  function createLayerCard(layer) {
    const layerCard = createElement("div", `layer-card`, `layer-card-${numLayers}`, setupDetailsWrapper);
    const layerCardImg = createElement('img', 'layer-card-img', `layer-card-img-${numLayers}`, layerCard)
    setImgSrc(layerCardImg, layer.iconPath);
    const layerCardColor = createElement('div', 'layer-card-color', `layer-card-color-${numLayers}`, layerCard);
    updateElementStyle(layerCardColor, [{ 'backgroundColor': mapLayerColors[layer.colorName].legend }]);
    const layerCardColorText = createElement('p', 'layer-card-text', `layer-card-text-${numLayers}`, layerCardColor);
    setText(layerCardColorText, `${mapLayerColors[layer.colorName].legend}`);
    const layerCardDetails = createElement('div', 'layer-card-details', `layer-card-details-${numLayers}`, layerCard);
    const layerCardTitle = createElement('p', 'layer-card-title', `layer-card-title-${numLayers}`, layerCardDetails);
    setText(layerCardTitle, layer.layerDisplayName);
    const layerCardOptions = createElement('div', 'layer-card-details', `layer-card-details-${numLayers}`, layerCard);
    const layerCheckBox = createElement('input', 'layer-card-checkbox', `layer-card-checkbox${numLayers}`,
        layerCardOptions);
    const labelForCheckBox = createElement('label', 'layer-check-box-label', 'check-box-label-id', layerCardOptions);
    setText(labelForCheckBox, 'ACTIVE: ');
    layerCheckBox.type = 'checkbox';
    layerCheckBox.checked = 'true';
    layerCheckBox.addEventListener('click', () => layer.include = !layer.include);

    numLayers++;
  }

  /** Updates the web page to show the layer configuration options */
  function initializeLayers() {

    showElement(setupDetailsWrapper);
    setId(rightSideWrapper, 'customize-layer-wrapper');
    setText(rightSideWrapper, 'Configure Layers');

    const beginLayerConfigButton = createElement('div', 'initialize-button', 'layer-config-button', rightSideWrapper);
    const beginLayerConfigButtonText = createElement('p', 'layer-config-button-text', 'layer-config-button-text', beginLayerConfigButton);
    setText(beginLayerConfigButtonText, 'Configure Layers');
    const skipLayerConfigButton = createElement('div', 'initialize-button', 'skip-layer-config', rightSideWrapper);
    const skipLayerConfigButtonText = createElement('p', 'initialize-button-text', 'skip-layer-config-button-text', skipLayerConfigButton);
    setText(skipLayerConfigButtonText, 'Skip Configuration');

    skipLayerConfigButton.addEventListener('click', initializeMarkers);
    beginLayerConfigButton.addEventListener('click', customizeLayers);
  }

  /** Updates the web page to show the marker configuration options */
  function initializeMarkers() {
    mainDisplay.updateLayerArray();
    setupConfigMarkerButtons();
    clearDetailsWindow();
    const setupDetailsTitle = createSetupDetailsTitle();
    setText(setupDetailsTitle, 'Initialize Markers');
    mainDisplay.initializingMarkers = true;
    loadMarkerCards();
  }

  /** Calls build marker card for each marker detected */
  function loadMarkerCards() {
    _.each(mainDisplay.liveMarkers, m => buildMarkerCard(m.markerId));
    if (mainDisplay.initializingMarkers) {
      setTimeout(loadMarkerCards, 1000);
    }
  }

  /** Creates the actual marker card html element that holds data for configuring the markers. */
  function buildMarkerCard(id) {
    if (!(_.contains(cardsBuilt, id))) {
      let card = createElement('div', 'marker-card', `marker-card-${id}`, setupDetailsWrapper);
      let idSection = createElement('div', 'marker-card-id', '', card);
      let buttons = [];

      _.map(jobsData, job => {
        let button = createElement('div', 'marker-card-button', `${id} ${job} button`, card);
        let buttonText = createElement('div', 'marker-card-button-text', `${id} ${job} button-text`, button);
        setText(buttonText, job);
        button.addEventListener('click', updateJob);
      });
      setText(idSection, id);
      cardsBuilt.push(id);
    }

    function updateJob() {
      let deets = event.target.id.split(' ');
      let selectedJob = deets[1];
      let selectedId = deets[0];
      _.map(jobsData, job => {
        const element = getElement(`${selectedId} ${job} button`);
        if (job === selectedJob) {
          lightUpElement(element);
          assignJob(selectedId, job);
        } else {
          greyOutElement(element);
        }
      });
    }

  }


  function assignJob(id, job) {
    id = parseInt(id);
    const marker = getMarker(id);
    job = getJob(job);

    if (job.getAssigned()) {
      greyOutElement(getElement(`${job.getAssignedMarker()} ${job.name} button`));
      getMarker(job.getAssignedMarker()).setJob(null);
    }

    job.setAssigned(true);
    job.assignNewMarker(id);
    marker.setJob(job);
  }

  /** Clears the details window when changing between configuration apps.  i.e. changing from layers to markers */
  function clearDetailsWindow() {
    removeAllChildren(setupDetailsWrapper);
  }

  /** Finished the initialization script */
  function finishIntro() {

    if (mainDisplay.getState() === WORK_FROM_HOME_MODE) {
      debugData = new DebugData();
      createLegend();
      hideElement(getElement('landing-screen-wrapper'));
      showGroup([mainDisplay.addRemove, mainDisplay.largeYearDisplay, mainDisplay.legend]);
      mainDisplay.setCurYear(mainDisplay.curYear);
      showGroup([getElement('location-title'), getElement('scenario-title')])
    } else {
      mainDisplay.setState(INTROMODE);
      hideAllLayers(); // Hides all layers
      showGroup([getElement('landing-screen-wrapper'), getElement('location-title'), getElement('scenario-title')])
    }

    mainDisplay.initializingMarkers = false;
    hideElement(camWrap);

    removeChild(getElement("lower-section-wrapper"), initializeWrapper);
    removeChild(camWrap, rightSideWrapper);

    updateElementStyle(getElement("lower-section-wrapper"), [{ 'cursor': 'pointer' }]);

  }

  /** Changes the web page so that the buttons show configure marker options */
  function setupConfigMarkerButtons() {
    /* Create the Customize Marker Section
    *  I am using the camWrap element at the moment for the right side of the screen
    *  To place buttons. */
    setId(rightSideWrapper, 'customize-marker-wrapper');
    setText(rightSideWrapper, 'Configure Markers');

    const beginConfigButton = createElement('div', "initialize-button", 'begin-marker-config-button', rightSideWrapper);
    const beginConfigButtonText = createElement('p', 'initialize-button-text', '', beginConfigButton);
    setText(beginConfigButtonText, 'Configure Markers');

    const skipConfigButton = createElement('div', 'initialize-button', 'skip-marker-config-button', rightSideWrapper);
    const skipConfigButtonText = createElement('p', 'initialize-button-text', '', skipConfigButton);
    setText(skipConfigButtonText, 'Skip Configuration');

    beginConfigButton.addEventListener('click', finishIntro);
    skipConfigButton.addEventListener('click', finishIntro);
  }

  /** Creates the actual start button html element and skip to use defaults button */
  function createStartButton() {
    const startButtonWrapper = createElement('div', 'start-button-wrapper', 'start-button-wrapper', loadWrap);
    hideElement(startButtonWrapper);
    const startB = createElement('div', 'start-button', 'start-button', startButtonWrapper);
    const startT = createElement('p', 'start-button-text', 'start-button-text', startB);
    const useDefaultsButton = createElement('div', 'start-button', 'start-with-defaults', startButtonWrapper);
    const useDefaultsButtonText = createElement('p', 'start-button-text', 'start-with-Defaults-text', useDefaultsButton);
    const debugModeButton = createElement('div', 'start-button', 'debug-start', startButtonWrapper);
    const debugModeButtonText = createElement('p', 'start-button-text', 'debug-start-text', debugModeButton);
    setText(startT, 'Setup');
    setText(useDefaultsButtonText, 'Use Defaults');
    setText(debugModeButtonText, 'Debug');
    debugModeButton.addEventListener('click', startInWorkAtHomeMode);
    useDefaultsButton.addEventListener('click', startWithDefaults);
    return startB;
  }

  function startWithDefaults() {

    const loader2 = getElement('loading-wrapper-2');
    let building = true;

    showElement(loader2);
    mainDisplay.updateLayerArray();

    _.map(defaultMarkerData, m => {
      assignJob(m.id, m.job);
    });


    setTimeout(function() {
      hideElement(loader2)
    }, 5500);

    setTimeout(finishIntro, 5000);
  }

  function startInWorkAtHomeMode() {
    mainDisplay.setState(WORK_FROM_HOME_MODE);
    finishIntro();
  }

  /** Animates the moving does in the loading screen */
  function animateDots() {
    // Create Animation ELEMENT
    const lds = createElement('div', 'lds-ellipsis', 'loader', loadWrap);
    for (let i = 0; i < 4; i++) {
      createElement('div', '', '', lds);
    }
  }

  /** Creates the wrapper for the center element that holds the details */
  function createSetupDetailsWrapper() {
    let setDetails = createElement('div', 'setup-details', 'setup-details', initializeWrapper);
    hideElement(setDetails);
    return setDetails;
  }

  /** Creates the title of the details box */
  function createSetupDetailsTitle() {
    return createElement('h2', 'setup-details-title', 'setup-details-title', setupDetailsWrapper);
  }

  function customizeLayers() {
    setText(setupDetailsTitle, 'Customize Layers');
    _.map(mainDisplay.layers, layer => createLayerCard(layer));
    const confirmButton = getElement('layer-config-button');
    setText(getElement('layer-config-button-text'), 'Confirm Changes');
    confirmButton.addEventListener('click', initializeMarkers);
  }

  function buildLoadingWrapper() {
    return createElement('div', 'loading-wrapper', 'loading-wrapper', initializeWrapper);
  }

  function buildLoadWrapTitle() {
    let loadWrapTitle = createElement('h1', 'loading-title', 'loading-title', loadWrap);
    setText(loadWrapTitle, 'HAVEN');
    return loadWrapTitle;
  }
}
