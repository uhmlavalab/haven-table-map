/* This class represents the main display of the map
 *  Layers are added and removed through the checkAdd function.
 *
 */
class MainDisplay {

  constructor() {

    this.state = INITIALIZE; // Map state is initialized to INITIALIZE
    this.prevState = -1;
    this.curYear = 2016;
    this.curScenario = 'postapril';
    this.curChart = 0;
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.changeScenarioActive = false;
    this.initializingMarkers = false;
    this.baseBorderColor = '#FFFFFF';
    this.screenSaverMode = false;

    this.activeChart = null;

    this.addNext = null;
    this.addNextLayerId = -999;

    this.maxAddTime = 2500;
    this.addTimer = 0;

    this.addRemoveOptionText = getElement("addRemoveOption");
    this.addLayerOptionText = getElement("addLayerOption");
    this.addRemove = getElement('add-remove-wrapper');
    this.icons = getElement('displaying-icons-wrapper');
    this.legend = getElement('legend');
    this.mapElement = getElement('mapDiv');
    this.addBox = getElement("add-box");
    this.largeYearDisplay = getElement("largeYear");
    this.largeYearDisplayText = getElement("largeYearText");
    this.updateText = getElement("remove-text");
    this.addRemoveImage = getElement("addRemoveImage");

    /* Initialize Sounds */
    this.removeSound = new Sound("sounds/water-low.mp3");
    this.addSound = new Sound("sounds/water-high.mp3");
    this.layerSound = new Sound("sounds/click3.wav");
    this.loadSound = new Sound("sounds/bestIntro.m4a");
    this.clickSound = new Sound("sounds/click3.mp3");
    this.chartSound = new Sound("sounds/click3.mp3");
    this.liveMarkers = [];

    this.layers = [];
    this.trainCardWidth = 0;
    this.trainActiveWidth = 0;
    this.trainHeight = 96 + '%';
    this.trainActiveHeight = 120 + '%';

  }

  setTrainCardWidth(w) {
    this.trainCardWidth = w + '%';
    this.setTrainActiveWidth(w * 1.4);
  }
  getTrainCardWidth() {
    return this.trainCardWidth;
  }
  getTrainActiveHeight() {
    return this.trainActiveHeight;
  }
  getTrainActiveWidth() {
    return this.trainActiveWidth;
  }
  setTrainActiveWidth(w) {
    this.trainActiveWidth = w + '%';
  }
  getTrainHeight(){
    return this.trainHeight;
  }
  decrementYear() {
    if (this.getCurYear() > 2016) {
      this.setCurYear(this.getCurYear() - 1);
      this.updateYearChangeData();
    }
  }

  incrementYear() {
    if (this.getCurYear() < 2045) {
      this.setCurYear(this.getCurYear() + 1);
      this.updateYearChangeData();
    }
  }

  setCurYear(year) {
    this.curYear = year;
    setText(this.largeYearDisplayText, year);
  }

  /** Starting from intromode, this funciton changes the map to full screen by
   *   removing the intro slider and the intro map layer.
   */
  goFullscreen() {
    this.setState(FULLSCREEN);
    hideElement(getElement('landing-screen-wrapper'));
    showGroup([this.addRemove, this.largeYearDisplay, this.legend]);
    this.setCurYear(this.curYear);
  }

  updateLayerArray() {
    this.layers = _.filter(this.layers, layer => layer.include);
    createLegend();
  }
  updateYearChangeData() {
    pieChart.updateChart(this.curYear, this.curScenario);
    lineChart.updateChart(this.curYear, this.curScenario);
    barChart.updateChart(this.curYear, this.curScenario);
    map.setSolarParcelsColor(this.curYear, this.curScenario);
    map.setWindParcelsColor(this.curYear, this.curScenario);

  }

  addRemoveNextLayer() {
    let layer = this.addNext;
    if (layer.active) {
      this.removeALayer(layer);
    } else {
      this.addALayer(layer);
    }
  }

  isDebug() {
    return this.state === WORK_FROM_HOME_MODE;
  }
  addALayer(layer) {
    // Add The Layer
    layer.active = true;
    this.resetAddTimer();
    if (layer.layerName === "ial") {
      toggleIAL();
    } else {
      map.showLayer(layer.layerName);
    }

    if (layer.layerName === 'solar' || layer.layerName === 'wind') {
      this.initializeParcels(layer);
    }
    layer.showBorderColor();
    layer.lightUpLegend();
    this.addSound.play();
  }

  removeALayer(layer) {
    layer.active = false;
    this.resetAddTimer();
    if (layer.layerName === "ial") {
      toggleIAL();
    } else {
      map.hideLayer(layer.layerName);
    }
    layer.darkenLegend();
    layer.hideBorderColor();
    this.removeSound.play();
  }

  resetAddTimer () {
    /* When an item is added or removed, the timer starts so that
    it is not immediately removed by mistake */
    this.addTimer = getCurrentTime();
  }

  checkAddTimer() {
    return (getCurrentTime() - this.addTimer) > this.maxAddTime;
  }

  initializeParcels(layer) {
    if (layer.layerName === 'solar') {
      map.setSolarParcelsColor(this.curYear, this.curScenario);
    } else
      if (layer.layerName === 'wind') {
        map.setWindParcelsColor(this.curYear, this.curScenario);
      }
  }

  setChart(chart) {
    this.curChart = chart;
  }

  getChart() {
    return this.curChart;
  }

  updateLiveMarkers() {
    this.liveMarkers = _.union(videoArray[0].activeMarkers, videoArray[1].activeMarkers);
  }

  /* Sets the state of the map */
  setState(state) {
    this.prevState = this.state;
    this.state = state;
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

  getCurYear() {
    return this.curYear;
  }

}
