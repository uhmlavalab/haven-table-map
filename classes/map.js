const solarYearlyMW = [
  {
    "year": 2016,
    "postapril": 22183.4,
    "e3genmod": 22183.4
  },
  {
    "year": 2017,
    "postapril": 114349.1,
    "e3genmod": 114349.1
  },
  {
    "year": 2018,
    "postapril": 414144.22,
    "e3genmod": 414144.22
  },
  {
    "year": 2019,
    "postapril": 460696.29,
    "e3genmod": 460660.27
  },
  {
    "year": 2020,
    "postapril": 843028.42,
    "e3genmod": 837253.06
  },
  {
    "year": 2021,
    "postapril": 1023731.58,
    "e3genmod": 825701.03
  },
  {
    "year": 2022,
    "postapril": 1111142.9,
    "e3genmod": 933712.83
  },
  {
    "year": 2023,
    "postapril": 1213242.75,
    "e3genmod": 933241.49
  },
  {
    "year": 2024,
    "postapril": 1209319.15,
    "e3genmod": 933032.16
  },
  {
    "year": 2025,
    "postapril": 1392398.97,
    "e3genmod": 1362356.97
  },
  {
    "year": 2026,
    "postapril": 1420858.71,
    "e3genmod": 1362229.69
  },
  {
    "year": 2027,
    "postapril": 1443636.8,
    "e3genmod": 1361523.73
  },
  {
    "year": 2028,
    "postapril": 1445089.85,
    "e3genmod": 1360732.47
  },
  {
    "year": 2029,
    "postapril": 1417749.89,
    "e3genmod": 1360274.25
  },
  {
    "year": 2030,
    "postapril": 1813201.5,
    "e3genmod": 1360458.93
  },
  {
    "year": 2031,
    "postapril": 1820822.94,
    "e3genmod": 1360417.64
  },
  {
    "year": 2032,
    "postapril": 1854838.89,
    "e3genmod": 1359427.48
  },
  {
    "year": 2033,
    "postapril": 1854417.38,
    "e3genmod": 1359070.72
  },
  {
    "year": 2034,
    "postapril": 1863082.63,
    "e3genmod": 1357865.53
  },
  {
    "year": 2035,
    "postapril": 1855195.25,
    "e3genmod": 1359015.89
  },
  {
    "year": 2036,
    "postapril": 1833875.51,
    "e3genmod": 1358812.55
  },
  {
    "year": 2037,
    "postapril": 1826506.14,
    "e3genmod": 1357887.28
  },
  {
    "year": 2038,
    "postapril": 1807824.86,
    "e3genmod": 1356847.41
  },
  {
    "year": 2039,
    "postapril": 1803350.04,
    "e3genmod": 1355200.45
  },
  {
    "year": 2040,
    "postapril": 1604045.93,
    "e3genmod": 1935204.61
  },
  {
    "year": 2041,
    "postapril": 1502154.96,
    "e3genmod": 1923609.5
  },
  {
    "year": 2042,
    "postapril": 1513780.51,
    "e3genmod": 1918851.56
  },
  {
    "year": 2043,
    "postapril": 1516452.85,
    "e3genmod": 1917864.07
  },
  {
    "year": 2044,
    "postapril": 1497683.09,
    "e3genmod": 1914275.17
  },
  {
    "year": 2045,
    "postapril": 1044186.39,
    "e3genmod": 3969243.27
  }
]

class Map {

  constructor(mapDivId, mapImageUrl, mapImageWidth, mapImageHeight, scale) {
    this.scale = scale;
    this.mapDiv = d3.select(`#${mapDivId}`);
    this.width = mapImageWidth * this.scale;
    this.height = mapImageHeight * this.scale;
    this.rasterBounds = [[-158.281, 21.710], [-157.647, 21.252]];

    this.layers = {};

    this.projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0])

    this.path = d3.geo.path()
      .projection(this.projection)

    this.map = this.mapDiv.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    this.map.append('image')
      .attr('xlink:href', `${mapImageUrl}`)
      .attr('width', this.width)
      .attr('height', this.height)

  }

  addGeoJsonLayer(fileUrl, layerName, year, fillColor, lineColor, lineWidth) {
    d3.json(`${fileUrl}`, (error, geoData) => {
      const bounds = [this.projection(this.rasterBounds[0]), this.projection(this.rasterBounds[1])];
      const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
      const transform = [(this.width - scale * (bounds[1][0] + bounds[0][0])) / 2, (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2];

      const proj = d3.geo.mercator()
        .scale(scale)
        .translate(transform)

      const path = d3.geo.path()
        .projection(proj)

      const layer = {
        enabled: true,
        parcels: [],
        fillColor: fillColor,
        lineColor: lineColor,
        lineWidth: lineWidth,
        year: year
      }

      this.map.selectAll(layerName)
        .data(geoData.features)
        .enter().append('path')
        .attr("d", path)
        .attr('class', layerName)
        .each(function (d) {
          if (layerName == 'solar') {
            const cf = d.properties.cf;
            const capacity = d.properties.capacity;
            const value = cf * capacity * 8760;
            layer.parcels.push({ 'path': this, 'value': value });
          }
          else {
            d3.select(this)
              .style('fill', fillColor)
              .style('opacity', 0.5)
              .style('stroke', lineColor)
              .style('stroke-width', lineWidth + 'px')
          }
        }).call(() => {
          this.layers[layerName] = layer;
          if (layerName == 'solar') {
            this.layers[layerName].parcels.sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
            this.setSolarParcelsColor(year, 'postapril');
          }
        })
    });
  }

  setSolarParcelsColor(year, scenario) {
    this.layers['solar'].year = year;
    if (this.layers['solar'].enabled) {
      let solarTotal = 0;
      solarYearlyMW.forEach(el => {
        if (el.year == year) {
          solarTotal = el[scenario];
        }
      });
      this.layers['solar'].parcels.forEach(el => {
        if (solarTotal > 0) {
          d3.select(el.path)
            .style('fill', this.layers['solar'].fillColor)
            .style('opacity', 0.5)
            .style('stroke', this.layers['solar'].lineColor)
            .style('stroke-width', this.layers['solar'].lineWidth + 'px');
          solarTotal -= el.value;
        } else {
          d3.select(el.path)
            .style('fill', 'transparent')
            .style('opacity', 0.5)
            .style('stroke', this.layers['solar'].lineColor)
            .style('stroke-width', this.layers['solar'].lineWidth + 'px');
        }
      })
    }
  }

  toggleLayer(layerName) {
    this.layers[layerName].enabled = !this.layers[layerName].enabled;
    if (layerName == 'solar') {
      this.setSolarParcelsColor(this.layers['solar'].year);
    }
    if (!this.layers[layerName].enabled) {
      this.map.selectAll(`.${layerName}`).style('opacity', 0.0);
    } else {
      this.map.selectAll(`.${layerName}`).style('opacity', 0.5);
    }

  }

  hideLayer(layerName) {
    this.layers[layerName].enabled = false;
    if (layerName == 'solar') {
      this.setSolarParcelsColor(this.layers['solar'].year);
    }
      this.map.selectAll(`.${layerName}`).style('opacity', 0.0);
  }

  showLayer(layerName) {
    this.layers[layerName].enabled = true;
    if (layerName == 'solar') {
      this.setSolarParcelsColor(this.layers['solar'].year);
    }
      this.map.selectAll(`.${layerName}`).style('opacity', 0.5);
  }

  removeLayer(layerName) {
    this.map.selectAll(`.${layerName}`).remove();
  }
}
