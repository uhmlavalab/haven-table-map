class Layer {

  constructor() {
    this.active = false;
  }

  updateColor() {

    let id = 0;

    for (let i = 0; i < this.legendColorTags.length; i++) {
    document.getElementById(this.legendColorTags[i]).style.backgroundColor = this.colors[i];
  }
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
    this.colors = ["white", mapLayerColors.Solar.fill];
    this.numLegendRows = 2;
    this.updateColor();
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
    this.legendColorTags = ["transmission-color"];
    this.colors = [mapLayerColors.Transmisison.border];
    this.numLegendRows = 1;
    this.updateColor();
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
    this.colors = [mapLayerColors.Dod.fill];
    this.numLegendRows = 1;
    this.updateColor();
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
    this.colors = [mapLayerColors.Parks.fill];
    this.numLegendRows = 1;
    this.updateColor();
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
    this.colors = [mapLayerColors.Existing_RE.fill];
    this.numLegendRows = 1;
    this.updateColor();
  }
}

class WindLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/wind-icon.png";
    this.iconText = "wind";
    this.classTag = "wind";
    this.legendTags = ["Unused Wind Land", "Used Wind Land"];
    this.legendColorTags = ["unused-wind", "used-wind"];
    this.iconTag = "wind-icon";
    this.colors = ["white", mapLayerColors.Wind.fill];
    this.numLegendRows = 2;
    this.updateColor();
  }

}

class AgricultureLayer extends Layer {

  constructor() {
    super();
    this.iconPath = "images/icons/agriculture-icon.png";
    this.iconText = "Ag Lands";
    this.iconTag = "ag-icon";
    this.classTag = "agriculture";
    this.legendTags = ["Agriculture"];
    this.legendColorTags = ["ag-color"];
    this.colors = [mapLayerColors.Agriculture.fill];
    this.numLegendRows = 1;
    this.updateColor();
  }
}
