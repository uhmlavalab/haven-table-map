/* This class represents the main display of the map
 *  Layers are added and removed through the checkAdd function.
 *
 */
class MainDisplay {

  constructor() {
    this.addRemove = document.getElementById('add-remove-wrapper');
    this.icons = document.getElementById('displaying-icons-wrapper');
    this.legend = document.getElementById('legend');
    this.mapElement = document.getElementById('mapDiv');
    this.state = INITIALIZE; // Map state is initialized to INTROMODE
    this.prevState = -1;
    this.displayCams = false;
    this.curYear = 2017;
    this.curScenario = 'postapril';
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.loadSound = new Sound("sounds/mac.mp3");
    //this.clickSound = new Sound("sounds/click3.mp3");
    this.loadingElem = document.getElementById("loading");
    this.changeScenarioActive = false;
    this.activeScenario = 'e3genmod';

    this.clickSounds = [];
      for (let i = 2018; i < 2046; i++) {
        this.clickSounds.push(new Sound("sounds/blockTones/" + i + ".wav"));
      }
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

    // Camera 0 covers the upper section of the map
    let v = videoArray[1];

    if (v.activeMarkers.length == 0) {
      return;
    } else {
      for (let m of v.activeMarkers) {

        if (m.getCenterX() > 113) {
          this.addLayer(m);
        } else {
          this.removeLayer(m);
        }
      }
    }
  };

  addLayer(m) {


      if (m.layerActive) {
        return;
      } else {
        m.layerActive = true;
      }


    let id = -1;

    switch (m.markerId) {

      case 256:
        id = 0;
        map.showLayer('solar');
        break;

      case 64:
        id = 1
        map.showLayer('dod');
        break;
/*
      case 384:
        id = 4;
        map.showLayer("parks");
        break;
        */

      case 832:
        id = 3;
        map.showLayer("existing_re");
        break;

    }

    let iconTagString = layers[id].iconTag;
    document.getElementById(iconTagString).style.opacity = 1;
    for (let i = 0; i < layers[id].legendColorTags.length; i++) {
      let idString = layers[id].legendColorTags[i];
      document.getElementById(idString).style.display = "block";
      document.getElementById(idString).style.width = 80 + '%';
    }

    m.addSound.play();
    /* Flash Green */
    let addBox = document.getElementById("add-box");

    let i = 1;

    let fadeBox = setInterval(fadeAddBox, 1);

    function fadeAddBox() {
      addBox.style.backgroundColor = `rgba(26, 119, 5, ${i})`;
      i -= 0.07;

      if (i <= 0) {
        clearInterval(fadeBox);
      }

    };
    if (layers[id].active) {
      return;
    } else {
      layers[id].active = true;
    }
  };

  removeLayer(m) {


    if (!m.layerActive || !this.changeScenarioActive) {
      return;
    } else {

      let id = -1;

      switch (m.markerId) {

        case 256:
          id = 0;
          map.hideLayer('solar');
          break;

        case 64:
          id = 1;
          hideLayer("dod");
          break;
/*
        case 384:
          id = 4;
          map.hideLayer("parks");
          break;
*/
        case 832:
          id = 3;
          map.hideLayer('existing_re');
          break;

      }

      let iconTagString = layers[id].iconTag;
      document.getElementById(iconTagString).style.opacity = 0.3;
      for (let i = 0; i < layers[id].legendColorTags.length; i++) {
        let idString = layers[id].legendColorTags[i];
        document.getElementById(idString).style.display = "none";
        document.getElementById(idString).style.width = 0 + '%';
      }

      m.removeSound.play();

      /* Flash Green */
      let removeBox = document.getElementById("remove-box");
      let i = 1;
      let fadeBoxR = setInterval(fadeRemoveBox, 1);

      function fadeRemoveBox() {
        removeBox.style.backgroundColor = `rgba(114, 17, 0, ${i})`;
        i -= 0.07;

        if (i <= 0) {
          clearInterval(fadeBoxR);
        }

      };

      m.setActive(false);
      m.layerActive = false;
      layers[id].active = false;

    }
  };

  /* Script executes when the main marker is placed in the add section
  of the map.  It allows the user to switch between scenarios. */
  changeScenario() {
    let addBox = document.getElementById('add-box');
    addBox.style.opacity = 0;
    let removeText = document.getElementById('remove-text');
    removeText.innerHTML = "Place Marker to confirm scenario";
    let regInst = document.getElementById("normal-instructions");
    let scenInst = document.getElementById("change-scenario-instructions");
    regInst.style.display = "none";
    scenInst.style.display = "block";
    document.getElementById('change-scenario-area').style.display = "block";

  }

  confirmChangeScenario() {

  }

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
    document.getElementById("largeYear").style.display = "block";
    document.getElementById("legend").style.display = "block";

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
    } else if (year < 2018) {
      year = 2018;
    }

    if (this.getCurYear() === year && this.timer <= 0) {
      this.loadingElem.style.display = "block";
      map.setSolarParcelsColor(year, this.curScenario);
      setTimeout(function() {
        mainDisplay.loadingElem.style.display = "none";
      }, 400);
      this.timer = 20;
      this.runTimer = false;
    } else if (this.getCurYear() === year && this.timer > 0 && this.runTimer) {
      this.timer--;
    } else if (this.getCurYear() !== year) {

      this.curYear = year;
      //this.clickSound.play();
      this.clickSounds[this.getCurYear() - 2018].play();
      pieChart.updateChart(this.curYear, this.curScenario);
      lineChart.updateChart(this.curYear, this.curScenario);
      this.timer = 20;
      this.runTimer = true;

    }

    document.getElementById("largeYearText").innerHTML = this.curYear;
  }

  setScenario(scenario) {
    this.curScenario = scenario;
    pieChart.updateChart(this.curYear, this.curScenario);
    lineChart.updateChart(this.curYear, this.curScenario);
    map.setSolarParcelsColor(this.curYear, this.curScenario)

  }

  selectScenario(m) {
    let scenarioInsert = document.getElementById("scenario-insert");
    if ((m.getRotation() >= 0 && m.getRotation() < 90) || (m.getRotation() >= 180 && m.getRotation() < 270)) {

      scenarioInsert.innerHTML = "E3";
      this.activeScenario = 'e3genmod';
    } else {

      scenarioInsert.innerHTML = "Post April";
      this.activeScenario = 'postapril';

    }

    this.setScenario(this.activeScenario);
  }

}
