class Layer {

  constructor(layerData) {

    this.active = false;
    this.iconElement;
    this.layerLegendElement;
    this.layerTextElement;
    this.colorElement;
    this.colorName = layerData.colorName;
    this.layerName = layerData.name;
    this.layerDisplayName = layerData.displayName;
    this.iconPath = `images/icons/${this.layerName}-icon.png`;
    this.include = true;
    this.createFn = layerData.createFn;

  }

  createLegendElement() {

    this.layerLegendElement = createElement("div", 'legend-card', `${this.layerName}-legend`, getElement('legend'));
    this.iconElement = createElement('img', 'icon-element', 'icon-element', this.layerLegendElement);
    this.darkenIcon();
    setImgSrc(this.iconElement, this.iconPath);
    this.colorElement = createElement('div', `legend-color`, `${this.layerName}-color`, this.layerLegendElement);
    this.colorElement.style.backgroundColor = mapLayerColors[this.colorName].legend;
    this.hideColorElement();
    this.layerTextElement = createElement("h4", '', '', this.layerLegendElement);
    setText(this.layerTextElement, this.layerDisplayName);
  }

  createTrainCard() {
    let total = mainDisplay.layers.length;
    if (total < 8) {
      total = 8;
    }
    let width = 70 / total + '%';
    const margin = 5 /total + '%';
    mainDisplay.setTrainCardWidth(width);

    const trainCard = createElement('div','layer-train-card', `layer-train-card-${this.layerName}`, getElement('layer-train'));
    updateElementStyle(trainCard, [{'width': width},{'height': '100%'}, {'margin':margin}]);
    const trainImg = createElement('img', 'layer-train-img', 'layer-train-img', trainCard);
    setImgSrc(trainImg, this.iconPath);

  }

  updateIcon() {
    setImgSrc(this.iconTag, this.iconPath);
  }

  lightUpLegend() {
    this.brightenIcon();
    this.showColorElement();
  }

  darkenLegend() {
    this.darkenIcon();
    this.hideColorElement();
  }

  getColor() {
    return mapLayerColors[this.colorName];
  }

  darkenIcon() {
    setOpacity(this.iconElement, 0.3);
  }

  brightenIcon() {
    setOpacity(this.iconElement, 1);
  }

  hideColorElement() {
    updateElementStyle(this.colorElement, [{ 'border-color': 'black' }]);
    setWidthByPercentage(this.colorElement, 0);
  }

  showColorElement() {
    updateElementStyle(this.colorElement, [{ 'border-color': 'white' }]);
    setWidthByPercentage(this.colorElement, 20);
  }

  showBorderColor() {
    const style = `12px solid ${mapLayerColors[mainDisplay.addNext.colorName].legend}`;
    updateElementStyle(getElement("add-box"), [{ 'border': style }]);
    updateElementStyle(getElement('layer-train'),[{'background-color': mapLayerColors[mainDisplay.addNext.colorName].legend}]);
  }

  hideBorderColor() {
    const style = `12px solid #FFFFFF`;
    updateElementStyle(getElement("add-box"), [{ 'border': style }]);
    updateElementStyle(getElement('layer-train'), [{'background-color': 'white'}]);
  }
}

