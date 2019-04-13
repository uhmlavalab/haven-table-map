function subscribeToLayerPosition(layerTitle, iconPath, imageTag) {
  let layerElement = document.getElementById('layer-detail');
  let image = document.getElementById('layer-card-image');
  image.src = `images/${imageTag}.jpg`;
  layerElement.innerHTML = layerTitle;
}

function subscribeToYear(currentYear) {
  let yearElement = document.getElementById('year-display');
  yearElement.innerHTML = currentYear;
}

function subscribeToScenarioData(scenario) {
  document.getElementById('scenario-display').innerHTML = scenario;
}
