// #7F3C8D,#11A579,#3969AC,#F2B701,#E73F74,#80BA5A,#E68310,#008695,#CF1C90,#f97b72,#4b4b8f,#A5AA99

const chartColors = {
  DGPV: '#E17C05',
  PV: '#EDAD08',
  Fossil: '#CC503E',
  Bio: '#73AF48',
  Battery: '#5F4690',
  Wind: '#38A6A5',
  Offshore: '#5F4690',
}

let mapLayerColors = {
  Solar: {
    fill: chartColors.DGPV,
    border: 'white',
    legend: chartColors.DGPV
  },
  Dod: {
    fill: '#CC503E',
    border: 'white',
    legend: '#CC503E'
  },
  Wind: {
    fill: chartColors.Wind,
    border: 'white',
    legend: chartColors.Wind
  },
  Existing_RE: {
    fill: '#38A6A5',
    border: 'white',
    legend: '#38A6A5'
  },
  Transmission: {
    fill: 'transparent',
    border: '#ccff00',
    legend: '#ccff00'
  },
  Agriculture: {
    fill: '#0F8554',
    border: 'white',
    legend: '#0F8554'
  },
  Parks: {
    fill: '#994E95',
    border: 'white',
    legend: '#994E95'
  },
  Ial: {
    fill: 'white',
    border: 'white',
    legend: '#000000'
  }
}

const layerData = [
  {
    name: 'solar',
    displayName: 'Solar Energy',
    colorName: 'Solar',
    createFn: () => map.addGeoJsonLayer('../layers/solar.json', 'solar', 2020, mapLayerColors.Solar.fill, mapLayerColors.Solar.border, 0.2)
  },
  {
    name: 'transmission',
    displayName: 'Transmission Lines',
    colorName: 'Transmission',
    createFn: () => map.addGeoJsonLayer('../layers/transmission.json', 'transmission', null, mapLayerColors.Transmission.fill, mapLayerColors.Transmission.border, 1.0)

  },
  {
    name: 'dod',
    displayName: 'DOD Lands',
    colorName: 'Dod',
    createFn: () => map.addGeoJsonLayer('../layers/dod.json', 'dod', null, mapLayerColors.Dod.fill, mapLayerColors.Dod.border, 0.5)
  },
  {
    name: 'parks',
    displayName: 'Park Lands',
    colorName: 'Parks',
    createFn: () => map.addGeoJsonLayer('../layers/parks.json', 'parks', null, mapLayerColors.Parks.fill, mapLayerColors.Parks.border, 0.5)

  },
  {
    name: 'existing_re',
    displayName: 'Existing Renewables',
    colorName: 'Existing_RE',
    createFn: () => map.addGeoJsonLayer('../layers/existing_re_2.json', 'existing_re', null, mapLayerColors.Existing_RE.fill, mapLayerColors.Existing_RE.border, 0.5)
  },
  {
    name: 'wind',
    displayName: 'Wind Energy',
    colorName: 'Wind',
    createFn: () => map.addGeoJsonLayer('../layers/wind_2.json', 'wind', 2020, mapLayerColors.Wind.fill, mapLayerColors.Wind.border, 0.25)
  },
  {
    name: 'agriculture',
    displayName: 'Ag Lands',
    colorName: 'Agriculture',
    createFn: () => map.addGeoJsonLayer('../layers/agriculture.json', 'agriculture', null, mapLayerColors.Agriculture.fill, mapLayerColors.Agriculture.border, 0.5)

  },
  {
    name: 'ial',
    displayName: 'Important Ag Lands',
    colorName: 'Ial',
    createFn: function() {console.log("missing Ial Function")}
  }];

const jobsData = ['Year', 'Scenario', 'Charts', 'Layer'];

const scenarioData = [{'name':'e3genmod', 'text': 'E3'}, {'name':'postapril', 'text':'Post April'}];

