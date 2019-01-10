const solarYearlyMW = { '2037': 935925.1199999977, '2036': 935862.4799999989, '2035': 935876.8350000028, '2034': 935920.7699999972, '2033': 935961.6599999986, '2032': 935903.8050000019, '2031': 935859.4349999989, '2030': 935865.5249999996, '2019': 32271.224999999933, '2017': 0.0, '2016': 0.0, '2039': 935961.6599999986, '2018': 32271.615000000056, '2044': 1538419.0250000046, '2045': 4077172.089999992, '2042': 1538251.7149999999, '2043': 1538359.6800000041, '2040': 1538252.4300000027, '2041': 1538261.7249999968, '2024': 505582.52500000154, '2025': 935859.4349999989, '2026': 935925.1199999977, '2027': 935900.3250000016, '2020': 419553.0300000012, '2021': 419541.5249999996, '2022': 505634.46000000124, '2023': 505612.370000001, '2038': 935900.3250000016, '2028': 935932.9500000031, '2029': 935876.8350000028 }

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

  addGeoJsonLayer(fileUrl, layerName, year, color) {
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
        color: color,
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
              .style('fill', color)
              .style('opacity', 0.5)
              .style('stroke', '#ffffff')
              .style('stroke-width', '.5px')
          }
        }).call(() => {
          this.layers[layerName] = layer;
          if (layerName == 'solar') {
            this.layers[layerName].parcels.sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
            this.setSolarParcelsColor(year);
          }
        })
    });
  }

  setSolarParcelsColor(year) {
    this.layers['solar'].year = year;
    if (this.layers['solar'].enabled) {
      let solarTotal = solarYearlyMW[this.layers['solar'].year.toString()];
      this.layers['solar'].parcels.forEach(el => {
        if (solarTotal > 0) {
          d3.select(el.path)
            .style('fill', this.layers['solar'].color)
            .style('opacity', 0.5)
            .style('stroke', '#ffffff')
            .style('stroke-width', '.5px');
          solarTotal -= el.value;
        } else {
          d3.select(el.path)
            .style('fill', '#ffffff')
            .style('opacity', 0.5)
            .style('stroke', '#ffffff')
            .style('stroke-width', '.5px')
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
