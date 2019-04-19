function start() {
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
  addThirdScreenSelector();

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
    slideRight('select-wrapper');
    slideLeft('setup-cams-wrapper');
    setOpacity(getElement('main-buttons-wrapper'), 0);
    showElement(secondaryButtonsWrapper, 1);
  });

  const setupMarkersButton = createElement('div', 'sidebar-button', 'setup-markers-button', mainButtonsWrapper);
  setText(setupMarkersButton, 'Setup Markers');
  const setupLayersButton = createElement('div', 'sidebar-button', 'setup-layers-button', mainButtonsWrapper);
  setText(setupLayersButton, 'Setup Layers');
  const calibrateSurfaceButton = createElement('div', 'sidebar-button', 'calibrate-button', mainButtonsWrapper);
  setText(calibrateSurfaceButton, 'Calibrate Surface');

  const backButton = createElement('div', 'sidebar-button', 'back-button', secondaryButtonsWrapper);
  hideElement(secondaryButtonsWrapper);
  setText(backButton, 'Back');

  backButton.addEventListener('click', () => {
    slideRight('setup-cams-wrapper');
    slideLeft('select-wrapper');
    setOpacity(getElement('main-buttons-wrapper'), 1);
    hideElement(secondaryButtonsWrapper, 1);
  });

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
      setTimeout(() => {
        mainAppWindow.subscribeToStartApp(island, getElement('select-third-screen-checkbox').checked);
      }, 200);
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

onload = start;
