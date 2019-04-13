function updateAddRemove() {
  const m = getMarker(jobs.Layer.assignedMarker);
  let index = m.job.addRemoveIndex;
  if (m.getDirection() === 'left') {
    index = decrementLayerIndex(index);
  } else
  if (m.getDirection() === 'right') {
    index = ((index + 1) % mainDisplay.layers.length);
  } else {
    return;
  }
  mainDisplay.clickSound.play();
  m.setDirection('none');
  m.job.addRemoveIndex = index;
  updateAddRemoveData(index);
}

function decrementLayerIndex(index) {
  if (index === 0) {
    return mainDisplay.layers.length - 1;
  } else {
    return (index - 1);
  }
}

function updateAddRemoveData(id) {

  mainDisplay.addNext = mainDisplay.layers[id];
  setText(
    mainDisplay.updateText,
    mainDisplay.addNext.layerDisplayName
  );
  setImgSrc(
    mainDisplay.addRemoveImage,
    mainDisplay.addNext.iconPath
  )
  let text = mainDisplay.addNext.active ? 'remove' : 'add';
  setText(mainDisplay.addRemoveOptionText, text);
  let style = mainDisplay.addNext.active ? `12px solid ${mapLayerColors[mainDisplay.addNext.colorName].legend}` : `12px solid #FFFFFF`;
  let color = mainDisplay.addNext.active ? mapLayerColors[mainDisplay.addNext.colorName].legend : `#FFFFFF`;
  updateElementStyle(getElement("add-box"), [{
    'border': style
  }]);
  updateElementStyle(getElement("layer-train"), [{
    'background-color': color
  }]);
  setText(mainDisplay.addLayerOptionText, mainDisplay.addNext.layerName);
  updateTrain();
  subApp.subscribeToLayerPosition(mainDisplay.addNext.layerDisplayName, mainDisplay.addNext.iconPath, mainDisplay.addNext.layerName);
}

function changeYear() {
  const m = getMarker(jobs.Year.assignedMarker);
  switch (m.getDirection()) {
    case 'left':
      mainDisplay.decrementYear();
      mainDisplay.clickSound.play();
      m.setDirection('none');
      break;
    case 'right':
      mainDisplay.incrementYear();
      mainDisplay.clickSound.play();
      m.setDirection('none');
      break;
    default:
      return;
  }


  updateYear();
}

function updateYear() {
  setText(mainDisplay.largeYearDisplayText, mainDisplay.curYear);
  subApp.subscribeToYear(mainDisplay.curYear);
}

function changeScenario() {
  const m = getMarker(jobs.Scenario.assignedMarker);
  if (m.getDirection() !== 'none') {
    let scenario = mainDisplay.curScenario === 'postapril' ? scenarioData[0] : scenarioData[1];
    setText(getElement("scenario-insert"), scenario.text);
    mainDisplay.curScenario = scenario.name;
    mainDisplay.clickSound.play();
    mainDisplay.updateYearChangeData();
    subApp.subscribeToScenarioData(scenario.text);
  }
}

function changeChart() {
  const m = getMarker(jobs.Charts.assignedMarker);
  if (m.getDirection() !== 'none') {
    (mainDisplay.getChart() === 0) ? mainDisplay.setChart(1): mainDisplay.setChart(0);
    (mainDisplay.getChart() === 0) ? showPieChart(): showBarChart();
  }
}

function toggleIAL() {
  map.toggleIAL();
}

function showPieChart() {
  let spaces = '';
  for (let i = 0; i < 35; i++) {
    spaces += '&nbsp;';
  }
  if (mainDisplay.activeChart === 'pie') {
    return;
  }
  document.getElementById('chartTitle').innerHTML = `${spaces}Energy Generation`;

  mainDisplay.activeChart = 'pie';
  barChart.hideElement();
  pieChart.showElement();
  mainDisplay.chartSound.play();
}

function showBarChart() {
  let spaces = '';
  for (let i = 0; i < 35; i++) {
    spaces += '&nbsp;';
  }

  if (mainDisplay.activeChart === 'bar') {
    return;
  }

  document.getElementById('chartTitle').innerHTML = `${spaces}Battery Utilization`;
  mainDisplay.activeChart = 'bar';
  pieChart.hideElement();
  barChart.showElement();
  mainDisplay.chartSound.play();
}

function hideAllLayers() {
  _.map(mainDisplay.layers, layer => {
    if (layer.layerName !== 'ial')
      map.hideLayer(layer.layerName);
  });
}

function showAllLayers() {
  _.map(mainDisplay.layers, layer => {
    if (layer.layerName !== 'ial')
      map.showLayer(layer.layerName);
  });
}

function createLegend() {
  _.map(mainDisplay.layers, layer => {
    layer.createFn();
    layer.createLegendElement();
    layer.createTrainCard();
  });
}

function updateTrain() {
  let activeHeight = mainDisplay.getTrainActiveHeight();
  let activeWidth = mainDisplay.getTrainActiveWidth();
  let width = mainDisplay.getTrainCardWidth();
  let height = mainDisplay.getTrainHeight();

  _.map(mainDisplay.layers, layer => updateElementStyle(getElement(`layer-train-card-${layer.layerName}`), [{
    'width': width
  }, {
    'height': height
  }, {
    'opacity': 0.7
  }]));

  updateElementStyle(getElement(`layer-train-card-${mainDisplay.addNext.layerName}`), [{
    'width': activeWidth
  }, {
    'height': activeHeight
  }, {
    'opacity': 1
  }]);

}

function reset() {
  mainDisplay.curYear = 2016;
  updateYear();
  _.map(mainDisplay.layers, layer => mainDisplay.removeALayer(layer));
}

function screenSaver(on) {
  let showHide = on ? 'block' : 'none';

  mainDisplay.legend.style.display = showHide;
  getElement('add-remove-wrapper').style.display = showHide;
  getElement('layer-train').style.display = showHide;
  getElement('instructions-wrapper').style.display = showHide;
  mainDisplay.largeYearDisplay.style.display = showHide;

  let vid = getElement('myVideo');
  if (showHide === 'block') {
    showHide === 'none';
  } else {
    showHide === 'block';
  }

  vid.style.display = showHide;
  mainDisplay.screenSaverMode = !mainDisplay.screenSaverMode;

}
