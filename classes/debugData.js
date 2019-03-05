class DebugData {
  constructor() {
    this.layerIndex = 0;
    this.createKeyboardListeners();
  }

  createKeyboardListeners() {
    document.addEventListener('keydown', function (event) {
      switch (event.code) {
        case 'KeyQ':
          mainDisplay.decrementYear();
          break;
        case 'KeyW':
          mainDisplay.incrementYear();
          break;
        case 'KeyA':
          debugData.layerIndex = decrementLayerIndex(debugData.layerIndex);
          console.log(debugData.layerIndex);
          updateAddRemoveData(debugData.layerIndex);
          break;
        case 'KeyS':
          debugData.layerIndex = ((debugData.layerIndex + 1) % mainDisplay.layers.length);
          updateAddRemoveData(debugData.layerIndex);
          break;
        case 'KeyD':
          mainDisplay.addRemoveNextLayer();
          break;
        case 'KeyZ':
          alert('Switch Scenario');
          break;
        case 'KeyX':
          alert('Switch Chart');
          break;
        case 'KeyH':
          hideAllLayers();
          break;
        case 'KeyJ':
          showAllLayers();
          break;
      }
    });
  }
}
