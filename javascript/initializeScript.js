function initialize() {
  let container = document.getElementById("lower-section-wrapper");

  let initializeContainer = document.createElement('div');
  initializeContainer.id = "initialize-wrapper";
  initializeContainer.className = "initialize-wrapper";

  container.appendChild(initializeContainer);

  let loadWrap = document.createElement('div');
  loadWrap.className = "loading-wrapper";
  initializeContainer.appendChild(loadWrap);

  let loadWrapTitle = document.createElement('h1');
  loadWrapTitle.id = "loading-title";
  loadWrapTitle.innerHTML = "HAVEN";
  loadWrap.appendChild(loadWrapTitle);

  // Create Animation ELEMENT
  let lds = document.createElement('div');
  lds.className = "lds-ellipsis";
  lds.id = "loader";
  loadWrap.appendChild(lds);

  for (let i = 0; i < 4; i++) {
    lds.appendChild(document.createElement('div'));
  }

  let startB = document.createElement('div');
  startB.className = "start-button";
  startB.id = "start-button";
  loadWrap.appendChild(startB);

  let startT = document.createElement('p');
  startT.innerHTML = "Begin Setup";
  startB.appendChild(startT);

  /* Build the Table that holds the menu buttons */

  let menuElem = document.createElement('div');
  menuElem.id = "align-island";
  menuElem.className = "align-island";
  container.appendChild(menuElem);

  let title = document.createElement('h2');
  title.innerHTML = "Settings";
  menuElem.appendChild(title);

  let table = document.createElement('table');
  menuElem.appendChild(table);
  let row = document.createElement('tr');
  table.appendChild(row);

  let showCameras = document.createElement('td');
  showCameras.id = "show-cams";
  showCameras.innerHTML = "Show Cameras";
  row.appendChild(showCameras);

  let con = document.createElement('div');
  con.id = "start-program";
  con.className = "start-program-button";

  menuElem.appendChild(con);
  let conText = document.createElement('p');
  conText.innerHTML = "Continue";
  con.appendChild(conText);

  document.getElementById("initialize-wrapper").style.display = "block";
  let start = document.getElementById("start-button");
  start.addEventListener("click", startSetup);
  setTimeout(hideLoader, 7000);

  title = document.getElementById("loading-title");

  let rotate = setInterval(rotateTitle, 5);
  let i = 1;

  function rotateTitle() {
    loadWrapTitle.style.transform = `rotateY(${i}deg)`;
    i += 0.5;
  }

  function hideLoader() {
    let loader = document.getElementById("loader");
    loader.style.display = "none";
    clearInterval(rotate);
    title.style.transform = `rotateY(0deg)`;
    start.style.display = "block";
  }

  function startSetup() {
  mainDisplay.loadSound.play();
    start.style.display = "none";
    title.style.display = "none";
    setupCams();
  }

  function setupCams() {
    let camWrap = document.getElementById('webcam-wrapper');
    let cam1 = document.getElementById('canvas1-wrapper');
    cam1.style.display = "block";

    let cam2 = document.getElementById('canvas3-wrapper');
    cam2.style.display = "block";

    let camText = document.createElement('p');
    camText.className = "cam-text";
    camText.innerHTML = 'Camera Setup <br/><br/> Align the Cameras with the rectangles.';
    camWrap.appendChild(camText);

    let camDoneBut = document.createElement('div');
    camDoneBut.className = "start-program-button";
    let camDoneButTxt = document.createElement('p');
    camDoneButTxt.innerHTML = "Continue";
    camText.appendChild(camDoneBut);
    camDoneBut.appendChild(camDoneButTxt);

    // Draw the overlay rectangles
    let rectangleOverlay = document.createElement('div');
    rectangleOverlay.style.height = "49vh";
    rectangleOverlay.style.width = "11vw";
    rectangleOverlay.style.zIndex = "3";
    rectangleOverlay.style.border = "5px solid orange";
    rectangleOverlay.style.top = "50vh";
    rectangleOverlay.style.position = "absolute";

    let addOverlay = document.createElement('div');
    addOverlay.style.height = "49vh";
    addOverlay.style.width = "11vw";
    addOverlay.style.zIndex = "3";
    addOverlay.style.border = "5px solid red";
    addOverlay.style.position = "absolute";

    let removeOverlay = document.createElement('div');
    removeOverlay.style.height = "49vh";
    removeOverlay.style.width = "11vw";
    removeOverlay.style.zIndex = "3";
    removeOverlay.style.border = "5px solid green";
    removeOverlay.style.left = "12vw";
    removeOverlay.style.position = "absolute";

    camWrap.appendChild(rectangleOverlay);
    camWrap.appendChild(addOverlay);
    camWrap.appendChild(removeOverlay);

    camDoneBut.addEventListener('click', chooseMap);
  }

  function chooseMap() {
    document.getElementById('webcam-wrapper').style.display = "none";
    finishIntro();
  }


  function finishIntro() {
    map.hideLayer('dod');
    map.hideLayer('parks');
    map.hideLayer('existing_re');
    map.hideLayer('solar');
    map.hideLayer('agriculture');
    map.hideLayer('transmission');
    map.hideLayer('wind');
    document.getElementById("initialize-wrapper").style.display = "none";
    document.getElementById("landing-screen-wrapper").style.display = "block";
    //document.getElementById("tracking-wrapper").style.display = "block";

    mainDisplay.setState(INTROMODE);

  }
}
