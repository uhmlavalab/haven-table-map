
class CapacityLine {

  constructor(lineDiv, dataUrl, year, colors) {
    this.lineDiv = document.getElementById(lineDiv);;
    this.year = year;
    this.chartData = [];
    this.labels = [];
    const color = colors;
    d3.csv(dataUrl, (data) => {
      this.data = data;
      this.data.sort((a, b) => Number(a.year) - parseFloat(b.year));
      data.forEach(el => {
        let trace = this.chartData.find(trace => trace.label == el.technology);
        if (!trace) {
          trace = {
            data: [],
            postaprildata: [],
            e3genmoddata: [],
            label: el.technology,
            backgroundColor: color[el.technology],
            borderColor: color[el.technology],
            pointRadius: 0,
            fill: false
          }
          this.chartData.push(trace);
        }
        this.labels.push(Number(el.year));
        trace.postaprildata.push(el.postapril);
        trace.e3genmoddata.push(el.e3genmod);
        trace.data.push(el.postapril);

      })
      this.labels = [...new Set(this.labels)];
      this.createChart();
    });
  }

  createChart() {
    this.ctx = this.lineDiv.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      options: {
        responsive: false,
        annotation: {
          annotations: [
            {
              drawTime: "afterDatasetsDraw",
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: this.year,
              borderWidth: 3,
              borderColor: "white",
              borderDash: [5, 5],
              label: {
                content: this.year,
                enabled: true,
                position: "top"
              }
            }
          ]
        },
        legend: {
          labels: {
            fontColor: "white",
            fontStyle: "bold",
            fontSize: 14
          }
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false,
              color: "#FFFFFF",
            },
            ticks: {
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: "white",

            },
            scaleLabel: {
              display: true,
              fontSize: 18,
              fontStyle: 'bold',
              fontColor: "#FFFFFF",
              labelString: 'Capacity'
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: "#FFFFFF",
            },
            ticks: {
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: "white",
              max: 3000
            },
            scaleLabel: {
              display: true,
              fontSize: 18,
              fontStyle: 'bold',
              fontColor: "#FFFFFF",
              labelString: 'Capacity'
            }
          }]
        }
      },
      data: {
        labels: this.labels,
        datasets: this.chartData
      },
    });
  }

  updateChart(year, scenario) {
    this.year = year;
    if(scenario.toLowerCase() == 'postapril') {
      this.chartData.forEach(el => {
        el.data = el.postaprildata;
      })
    }
    if(scenario.toLowerCase() == 'e3genmod') {
      this.chartData.forEach(el => {
        el.data = el.e3genmoddata;
      })
    }
    this.myChart.options.annotation.annotations[0].value = Number(this.year);
    this.myChart.options.annotation.annotations[0].label.content = this.year;
    this.myChart.update();
  }

}
