/* This class represents the main display of the map
 *  Layers are added and removed through the checkAdd function.
 *
 */
class MainDisplay {

  constructor() {

    this.state = INITIALIZE; // Map state is initialized to INTROMODE
    this.prevState = -1;
    this.curYear = 2017;
    this.curScenario = 'postapril';
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.loadSound = new Sound("sounds/bestIntro.m4a");
    this.clickSound = new Sound("sounds/click3.mp3");
    this.changeScenarioActive = false;

    this.activeChart = null;

    this.addNext = null;
    this.addNextLayerId = -999;

    this.artMax = 7; // Add remove timer max time
    this.addRemoveTimer = this.artMax; // Set the addRemoveTimer to max

    this.addRemoveOptionText = document.getElementById("addRemoveOption");
    this.addLayerOptionText = document.getElementById("addLayerOption");
    this.addRemove = document.getElementById('add-remove-wrapper');
    this.icons = document.getElementById('displaying-icons-wrapper');
    this.legend = document.getElementById('legend');
    this.mapElement = document.getElementById('mapDiv');
    this.addBox = document.getElementById("add-box");
    this.largeYearDisplay = document.getElementById("largeYear");
    this.largeYearDisplayText = document.getElementById("largeYearText");
    this.updateText = document.getElementById("remove-text");
    this.addRemoveImage = document.getElementById("addRemoveImage");


    this.removeSound = new Sound("sounds/water-low.mp3");
    this.addSound = new Sound("sounds/water-high.mp3");
    this.layerSound = new Sound("sounds/click3.wav");
    this.chartSound = new Sound("sounds/tick.mp3");
    this.timer = 0;
    this.runTimer = false;
  }

  /* Sets the state of the map */
  setState(state) {
    this.prevState = this.state;
    this.state = state;

    if (videosVisible && this.state !== DEBUG) {
      setVideosVisible(false);
    }
  };

  /* Gets the state of the map */
  getState() {
    return this.state;
  };

  /**
   * Whenever the window is resized for any reason, the map automatically adjusts
   * the height and width.
   */
  resizeMap() {

    /* Update VH and VW values */
    setVH();
    setVW();

    for (let v of videoArray) {
      v.setWidth(v.getWidth() * VW);
      v.setHeight(v.getHeight() * VH);
    }

  };

  /** Main execution function.  Detects map state and executes functions accoridngly */
  runMap(markerArray) {
    for (let m of markerArray) {
      if (m.getActive()) {
        executeMarkerFunction(m);
      }
    }

    switch (this.state) {

      case FULLSCREEN: // Normal operation.
        this.checkAdd();
        track(markerArray[0]);
        break;
    }
  };


  /**
   * Checks the section of the translucent plastic for any new markers.  If they are found,
   * this layer becomes active, displaying the icon and the legend. */
  checkAdd() {
    if (this.addRemoveTimer > 0) {
      this.addRemoveTimer--;
      return;
    }
    // Camera 0 covers the upper section of the map
    let v = videoArray[1];

    if (v.activeMarkers.length == 0) {
      return;
    } else {
      for (let m of v.activeMarkers) {

        if (m.markerId === 4) {
          this.addRemoveNextLayer();
        }
      }
    }
  };

  /** Starting from intromode, this funciton changes the map to full screen by
   *   removing the intro slider and the intro map layer.
   */
  goFullscreen() {

    this.setState(FULLSCREEN);

    // Change from the landing screen to main
    document.getElementById("landing-screen-wrapper").style.display = "none"; // Hide the landing screen

    // Display the add and remove boxes
    mainDisplay.addRemove.style.display = "block";

    // Display the Active marker icon
    this.largeYearDisplay.style.display = "block";
    this.legend.style.display = "block";

  };


  /**
   * Gets the x position of the map.
   * @return the x position of the map.
   */
  getX() {
    return this.mapX;
  };


  /**
   * Sets the x position of the map.
   * @param x The new x position of the map.
   */
  setX(x) {
    this.mapX = x;
  };

  /**
   * Gets the y position of the map.
   * @return The y position of the map.
   */
  getY() {
    return this.mapY;
  };


  /**
   * Sets the y position of the map.
   * @param y the new y position of the map image.
   */
  setY(y) {
    this.mapY = y;
  };

  /**
   * Gets the width of the map.
   * @return the width of the map.
   */
  getW() {
    return this.mapW;
  };


  /**
   * Sets the width of the map.
   * @param w The new x position of the map.
   */
  setW(w) {
    this.mapW = w;
  };

  /**
   * Gets the height of the map
   * @return The height of the map.
   */
  getH() {
    return this.mapH;
  };


  /**
   * Sets the height of the map.
   * @param h the new height of the map image.
   */
  setH(h) {
    this.mapH = h;
  };

  getCurYear() {
    return this.curYear;
  }

  setCurYear(year) {

    if (year > 2045) {
      year = 2045;
    } else if (year < 2016) {
      year = 2016;
    }

    if (this.getCurYear() === year && this.timer <= 0) {

      if (layers[0].active) {
        map.setSolarParcelsColor(year, this.curScenario);
      }
      if (layers[6].active) {
        map.setWindParcelsColor(year, this.curScenario);
      }

      this.timer = 8;
      this.runTimer = false;
    } else if (this.getCurYear() === year && this.timer > 0 && this.runTimer) {
      this.timer--;
    } else if (this.getCurYear() !== year) {

      this.curYear = year;
      this.clickSound.play();
      //this.clickSounds[this.getCurYear() - 2018].play();
      pieChart.updateChart(this.curYear, this.curScenario);
      lineChart.updateChart(this.curYear, this.curScenario);
      barChart.updateChart(this.curYear, this.curScenario);
      this.timer = 20;
      this.runTimer = true;

    }

    this.largeYearDisplayText.innerHTML = this.curYear;
  }

  setScenario(scenario) {
    this.chartSound.play();
    this.curScenario = scenario;
    pieChart.updateChart(this.curYear, this.curScenario);
    lineChart.updateChart(this.curYear, this.curScenario);
    barChart.updateChart(this.curYear, this.curScenario);
    map.setSolarParcelsColor(this.curYear, this.curScenario)
    map.setWindParcelsColor(this.curYear, this.curScenario);
  }

  selectScenario(m) {
    let scenarioInsert = document.getElementById("scenario-insert");

    let number = 360 / 8;
    let rotation = m.getRotation();

    for (let i = 0; i < 8; i++) {

      let min = number * i;
      let max = number * (i + 1)

      if ((rotation >= min) && (rotation < max)) {
        if (i % 2 === 0) {
          if (this.curScenario === 'e3genmod') {
            return;
          } else {
            this.showE3(scenarioInsert);
          }
        } else {
          if (this.curScenario === 'postapril') {
            return;
          } else {
            this.showPostApril(scenarioInsert)
          }
        }
        break;
      }
    }

    this.setScenario(this.curScenario);
  }

  showE3(scenarioInsert) {
    scenarioInsert.innerHTML = "E3";
    this.curScenario = 'e3genmod';
  }

  showPostApril(scenarioInsert) {
    scenarioInsert.innerHTML = "Post April";
    this.curScenario = 'postapril';

  }

  updateAddRemove(m) {
    let number = 360 / layers.length;
    let id = -999
    let rotation = m.getRotation();
    for (let i = 0; i < layers.length; i++) {
      if (i < layers.length - 1) {
        let min = number * i;
        let max = number * (i + 1)
        if ((rotation >= min) && (rotation < max)) {
          id = i;
          break;
        }
      } else {
        id = layers.length - 1;
      }
    }

    if (id >= 0) {
      if (this.addNextLayerId !== id) {
        this.addNextLayerId = id;
        this.layerSound.play();
      }
      this.updateAddRemoveData(id);
    }
  }

  updateAddRemoveData(id) {

    this.addNext = layers[id];
    this.updateText.innerHTML = this.addNext.layerName;
    this.addRemoveImage.src = this.addNext.iconPath;

    if (!(this.addNext.active)) {
      this.addRemoveOptionText.innerHTML = "add";
    } else {
      this.addRemoveOptionText.innerHTML = "remove";
    }

    if (this.addNext.active) {
      document.getElementById("add-box").style.border = `10px solid ${this.addNext.color}`;
    } else {
      document.getElementById("add-box").style.border = `10px solid #FFFFFF`;
    }
    this.addLayerOptionText.innerHTML = this.addNext.layerName;
  }

  addRemoveNextLayer() {
    let layer = this.addNext;
    if (layer.active) {
      this.removeALayer(layer);
      this.layerSound.play();
    } else {
      this.addALayer(layer);
    }
  }

  addALayer(layer) {
    // Add The Layer
    layer.active = true;
    this.startARTimer();
    if (layer.layerName === "Important Ag" ) {
      toggleIAL();
    } else {
      map.showLayer(layer.classTag);
    }

    this.lightUpLayerBorder(layer);
    if (layer.classTag === 'solar' || layer.classTag === 'wind') {
      this.initializeParcels(layer);
    }
    this.showLegend(layer);
    this.addSound.play();
  }

  removeALayer(layer) {
    layer.active = false;
    this.removeBorderColor();
    this.startARTimer();
    if (layer.layerName === "Important Ag") {
      toggleIAL();
    } else {
      map.hideLayer(layer.classTag);
    }
    this.hideLegend(layer);
    this.removeSound.play();
  }

  startARTimer() {
    /* When an item is added or removed, the timer starts so that
    it is not immediately removed by mistake */
    this.addRemoveTimer = this.artMax;
  }

  /* Lights Up the border of this layer in the Add/Remove Box */
  lightUpLayerBorder(layer) {
    this.addBox.style.border = `10px solid ${this.addNext.color}`;
  }

  removeBorderColor(layer) {
    this.addBox.style.border = `10px solid #FFFFFF`;
  }

  initializeParcels(layer) {
    if (layer.classTag === 'solar') {
      map.setSolarParcelsColor(this.curYear, this.curScenario);
    } else if (layer.classTag === 'wind') {
      map.setWindParcelsColor(this.cuYyear, this.curScenario);
    }
  }

  showLegend(layer) {
    document.getElementById(layer.iconTag).style.opacity = 1;

    let elem = document.getElementById(layer.legendColorTag);
    elem.style.display = "block";
    elem.style.width = 80 + '%';
  }

  hideLegend(layer) {

    document.getElementById(layer.iconTag).style.opacity = 0.3;
    let elem = document.getElementById(layer.legendColorTag);
    elem.style.display = "none";
    elem.style.width = 0 + '%';
  }

  toggleChart(m) {

    let number = 360 / 8;
    let rotation = m.getRotation();

    for (let i = 0; i < 8; i++) {

      let min = number * i;
      let max = number * (i + 1)

      if ((rotation >= min) && (rotation < max)) {
        (i % 2 === 0) ? showPieChart(): showBarChart();

        break;
      }
    }
  }
}
