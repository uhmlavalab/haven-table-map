class Layer {

  constructor() {
    this.active = false;
    this.iconElement;
  }

  updateColor() {

      document.getElementById(this.legendColorTag).style.backgroundColor = this.color;
  }

  updateIcon() {
    document.getElementById(this.iconTag).src = this.iconPath;
  }
}


class SolarLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Solar Power";
    this.iconPath = "images/icons/solar-icon.png";
    this.iconText = "Solar";
    this.classTag = "solar";
    this.legendTag = "Solar Energy";
    this.legendColorTag = "solar";
    this.iconTag = "solar-icon";
    this.color = chartColors.DGPV;
    this.updateColor();
    this.updateIcon();
  }

}

class TransmissionLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Transmission Lines";
    this.iconPath = "images/icons/transmission-lines.png";
    this.iconText = "Transmission";
    this.iconTag = "transmission-icon";
    this.classTag = "transmission";
    this.legendTag = "Transmission Lines";
    this.legendColorTag = "transmission-color";
    this.color = mapLayerColors.Transmisison.border;
    this.updateColor();
    this.updateIcon();
  }

}

class DODLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Department of Defense Lands";
    this.iconPath = "images/icons/dod-icon.png";
    this.iconText = "DOD Land";
    this.classTag = "dod";
    this.legendTag = "DOD Land";
    this.legendColorTag = "dod-color";
    this.iconTag = "dod-icon";
    this.color = mapLayerColors.Dod.fill;
    this.updateColor();
    this.updateIcon();
  }
}

class ParksLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Parks Lands";
    this.iconPath = "images/icons/park-icon.png";
    this.iconText = "Park Land";
    this.classTag = "parks";
    this.legendTag = "Park Lands";
    this.legendColorTag = "park-color";
    this.iconTag = "park-icon";
    this.color = mapLayerColors.Parks.fill;
    this.updateColor();
    this.updateIcon();
  }
}

class ExistingLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Existing Renewable Energy";
    this.iconPath = "images/icons/existing-renewables.png";
    this.iconText = "Existing";
    this.classTag = "existing_re";
    this.legendTag = "Existing";
    this.legendColorTag = "existing-color";
    this.iconTag = "existing-icon";
    this.color = mapLayerColors.Existing_RE.fill;
    this.updateColor();
    this.updateIcon();
  }
}

class WindLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Wind Energy";
    this.iconPath = "images/icons/wind-icon.png";
    this.iconText = "wind";
    this.classTag = "wind";
    this.legendTag = "Wind Energy";
    this.legendColorTag = "wind";
    this.iconTag = "wind-icon";
    this.color = mapLayerColors.Wind.fill;
    this.updateColor();
    this.updateIcon();

  }
}

class AgricultureLayer extends Layer {

  constructor() {
    super();
    this.layerName = "Agricultural Lands";
    this.iconPath = "images/icons/agriculture-icon.png";
    this.iconText = "Ag Lands";
    this.iconTag = "ag-icon";
    this.classTag = "agriculture";
    this.legendTag = "Agriculture";
    this.legendColorTag = "ag-color";
    this.color = mapLayerColors.Agriculture.fill;
    this.updateColor();
    this.updateIcon();
  }
}

  class IALLayer extends Layer {

    constructor() {
      super();
      this.layerName = "Important Ag";
      this.iconPath = "images/icons/pineapple copy.png";
      this.iconText = "Important Ag";
      this.iconTag = "ial-icon";
      this.classTag = "important ag";
      this.legendTag = "ial";
      this.legendColorTag = "ial-color";
      this.color = "#000000";
      this.updateColor();
      this.updateIcon();
    }
}
