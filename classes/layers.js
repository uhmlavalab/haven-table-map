class Layer {

  constructor() {
    this.active = false;
  }
}

class SolarLayer extends Layer {

  constructor() {
  super();
    this.iconPath = "images/icons/solar-icon.png";
    this.iconText = "Solar";
    this.classTag = "solar";
    this.legendTags = ["Unused Solar Land", "Used Solar Land"];
    this.legendColorTags = ["unused-solar", "used-solar"];
    this.iconTag = "solar-icon";
    this.colors = ["red", "yellow"];
    this.numLegendRows = 2;
  }

}

class TransmissionLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/transmission-icon.png";
    this.iconText = "Transmission";
    this.iconTag = "transmission-icon";
    this.classTag = "transmission";
    this.legendTags = ["Transmission Lines"];
    this.colors = ["green"];
    this.numLegendRows = 1;
  }

}

class SeaLevelLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/sea-level-rise-icon.png";
    this.iconText = "Sea Level";
    this.iconTag = "sea-level-rise-icon";
    this.classTag = "seaLevel";
    this.legendTags = ["Sea Level Rise"];
    this.colors = ["blue"];
    this.numLegendRows = 1;
  }
}

class DODLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/dod-icon.png";
    this.iconText = "DOD Land";
    this.classTag = "dod";
    this.legendTags = ["DOD Land"];
    this.legendColorTags = ["dod-color"];
    this.iconTag = "dod-icon";
    this.colors = ["orange"];
    this.numLegendRows = 1;
  }
}

class ParksLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/park-icon.png";
    this.iconText = "Park Land";
    this.classTag = "parks";
    this.legendTags = ["Park Lands"];
    this.legendColorTags = ["park-color"];
    this.iconTag = "park-icon";
    this.colors = ["green"];
    this.numLegendRows = 1;
  }
}

class ExistingLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/z-icon.png";
    this.iconText = "Existing";
    this.classTag = "existing";
    this.legendTags = ["Existing"];
    this.legendColorTags = ["existing-color"];
    this.iconTag = "existing-icon";
    this.colors = ["green"];
    this.numLegendRows = 1;
  }
}
