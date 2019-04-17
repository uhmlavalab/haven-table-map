function start() {
  const islandArray = ['Oahu', 'Big Island'];
  runTitleAnimation();
  populateSelectCards(islandArray);
  addThirdScreenSelector();
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
    let card = createElement('div', 'select-card', `select-card-${island}`, selectWrapper);
    let cardImg = createElement('img', 'select-card-image', `select-card-image-${island}`, card);
    let titleWrapper = createElement('div', 'select-card-title', `select-card-title-${island}`, card);
    setText(titleWrapper, island);
    setImgSrc(cardImg, `images/landing-images/${island}.jpg`);

    let startButton = createElement('div', 'start-application-button', `start-button-${island}`, card);
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
      setTimeout(()=>{
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
