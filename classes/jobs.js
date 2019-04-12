class Job {
  constructor(markerId, rotationMax) {
    this.assigned = false;
    this.assignedMarker = markerId;
    this.rotationMax = rotationMax;
  }

  getRotationMax() {
    return this.rotationMax;
  }
  getAssigned() {
    return this.assigned;
  }
  setAssigned(onOff) {
    this.assigned = onOff;
  }
  assignNewMarker(id) {
    this.assignedMarker = id;
  }
  getAssignedMarker(){
    return this.assignedMarker;
  }
}

class YearChanger extends Job {
  constructor(markerId) {
    super(markerId, 7);
    this.name = 'Year';
    this.myJob = changeYear;
  }
}

class ScenarioChanger extends Job {
  constructor(markerId) {
    super(markerId, 20);
    this.name = 'Scenario';
    this.myJob = changeScenario;
  }

}

class ChartChanger extends Job{
  constructor(markerId) {
    super(markerId, 20);
    this.name = 'Charts';
    this.myJob = changeChart;
  }
}

class LayerChanger extends Job {
  constructor(markerId) {
    super(markerId, 10);
    this.name = 'Layer';
    this.myJob = updateAddRemove;
    this.addRemoveIndex = 0;
  }
}

function createAllJobs() {
  jobs = {'Year': new YearChanger(-1), 'Scenario':new ScenarioChanger(-1), 'Charts': new ChartChanger(-1), 'Layer':new LayerChanger(-1)};
}
