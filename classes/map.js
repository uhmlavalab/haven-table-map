class Map {

  constructor(mapDivId, mapImageUrl, mapImageWidth, mapImageHeight, scale, bounds) {
    this.scale = scale;
    this.mapDiv = d3.select(`#${mapDivId}`);
    this.width = mapImageWidth * this.scale;
    this.height = mapImageHeight * this.scale;
    this.rasterBounds = bounds;
    this.curYear = null;
    this.curScenario = null;

    this.layers = {};
    this.IAL = false;

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

      console.log('Map: ' + island);

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
            const cf = d.properties.cf_1;
            const capacity = d.properties.capacity;
            const value = cf * capacity * 8760;
            const ial = (d.properties.IAL == "Y") ? true : false;
            layer.parcels.push({ 'path': this, 'value': value, 'ial': ial });
          }
          else if (layerName == 'wind') {
            const cf = 0.2283942;
            const capacity = d.properties.MWac;
            const value = cf * capacity * 8760;
            const type = d.properties.type;
            layer.parcels.push({ 'path': this, 'value': capacity, 'type': type });
          } 
          else if (layerName == "agriculture") {
            const colors = {
            'D': '#0f8554',
            'C': '#35996f',
            'B': '#63b090',
            'A': '#9dcdb9',
            'E': 'transparent'
          }
            const type = d.properties.type;
            const col = colors[type];
            d3.select(this)
              .style('fill', col)
              .style('opacity', 0.5)
              .style('stroke', lineColor)
              .style('stroke-width', lineWidth + 'px')
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
            this.layers[layerName].parcels.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
            this.setSolarParcelsColor(year, 'postapril');
          }
          if (layerName == 'wind') {
            this.layers[layerName].parcels.sort((a, b) => parseFloat(b.type) - parseFloat(a.type) || parseFloat(b.value) - parseFloat(a.value));
            this.setWindParcelsColor(year, 'postapril');
          }
        })
    });
  }

  setSolarParcelsColor(year, scenario) {
    this.curYear = year;
    this.curScenario = scenario;
    this.layers['solar'].year = year;
    if (this.layers['solar'].enabled) {
      let solarTotal = 0;
      parcelYearly[island.toLowerCase()].solar.forEach(el => {
        if (el.year == year) {
          solarTotal = el[scenario];
        }
      });
      this.layers['solar'].parcels.forEach(el => {
        if (el.ial && this.IAL) {
          d3.select(el.path)
          .style('fill', "#000000")
          .style('opacity', 1.0)
          .style('stroke', "#000000")// this.layers['solar'].lineColor)
          .style('stroke-width', this.layers['solar'].lineWidth + 'px');
        }
        else if (solarTotal > 0) {
          d3.select(el.path)
            .style('fill', this.layers['solar'].fillColor)
            .style('opacity', 0.75)
            .style('stroke', 'transparent')
            .style('stroke-width', 0);
          solarTotal -= el.value;
        } else {
          d3.select(el.path)
            .style('fill', this.layers['solar'].fillColor)
            .style('opacity', 0.25)
            .style('stroke', 'transparent')
            .style('stroke-width', 0);
        }
      })
    }
  }

  toggleIAL() {
    this.IAL = !this.IAL;
    this.setSolarParcelsColor(this.curYear, this.curScenario);
  }

  setWindParcelsColor(year, scenario) {
    this.layers['wind'].year = year;
    if (this.layers['wind'].enabled) {
      let windTotal = 0;
      parcelYearly[island.toLowerCase()].wind.forEach(el => {
        if (el.year == year) {
          // windTotal = el[scenario] - 99;
          windTotal = el[scenario];

        }
      });
      this.layers['wind'].parcels.forEach(el => {
        if (windTotal > 0) {
          d3.select(el.path)
            .style('fill', this.layers['wind'].fillColor)
            .style('opacity', 0.75)
            .style('stroke', 'transparent')
            .style('stroke-width', 0);
            windTotal -= el.value;
        } else {
          d3.select(el.path)
            .style('fill', this.layers['wind'].fillColor)
            .style('opacity', 0.35)
            .style('stroke', 'transparent')
            .style('stroke-width', 0);
        }
      })
    }
  }

  toggleLayer(layerName) {
    this.layers[layerName].enabled = !this.layers[layerName].enabled;
    if (layerName == 'solar') {
      this.setSolarParcelsColor(this.layers['solar'].year);
    }
    if (layerName == 'wind') {
      this.setWindParcelsColor(this.layers['wind'].year);
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
    if (layerName == 'wind') {
      this.setWindParcelsColor(this.layers['wind'].year);
    }
      this.map.selectAll(`.${layerName}`).style('opacity', 0.0);
  }

  showLayer(layerName) {
    this.layers[layerName].enabled = true;
    if (layerName == 'solar') {
      this.setSolarParcelsColor(this.layers['solar'].year);
    }
    if (layerName == 'wind') {
      this.setWindParcelsColor(this.layers['wind'].year);
    }
      this.map.selectAll(`.${layerName}`).style('opacity', 0.5);
  }

  removeLayer(layerName) {
    this.map.selectAll(`.${layerName}`).remove();
  }

  pSBC(p,c0,c1,l) {
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
}
