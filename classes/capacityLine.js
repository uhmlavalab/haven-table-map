
class CapacityLine {

  constructor(lineDiv, dataUrl, year) {
    this.lineDiv = document.getElementById(lineDiv);;
    this.year = year;
    this.chartData = [];
    this.labels = [];
    const color = {
      Fossil: 'rgba(255, 99, 132, 1.0)',
      Bio: 'rgba(75, 192, 192, 1.0)',
      Wind: 'rgba(153, 102, 255, 1.0)',
      DGPV: 'rgba(255, 159, 64, 1.0)',
      PV: 'rgba(255, 206, 86, 1.0)',
      Battery: 'rgba(54, 162, 235, 1.0)'
    };
    d3.csv(dataUrl, (data) => {
      this.data = data;
      this.data.sort((a, b) => Number(a.year) - parseFloat(b.year));
      data.forEach(el => {
        let trace = this.chartData.find(trace => trace.label == el.technology);
        if (!trace) {
          trace = {
            data: [],
            label: el.technology,
            backgroundColor: color[el.technology],
            borderColor: color[el.technology],
            fill: false,
            pointRadius: 0
          }
          this.chartData.push(trace);
        }
        this.labels.push(Number(el.year));
        trace.data.push(el.value);
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
            fontSize: 10
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
              fontSize: 10,
              fontStyle: 'bold',
              fontColor: "white",
            },
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: "#FFFFFF",
              labelString: 'Year'
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: "#FFFFFF",
            },
            ticks: {
              fontSize: 10,
              fontStyle: 'bold',
              fontColor: "white",
            },
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: "#FFFFFF",
              labelString: 'Capacity (MW)'
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

  updateChart(year) {
    this.year = year;
    this.myChart.options.annotation.annotations[0].value = Number(this.year);
    this.myChart.options.annotation.annotations[0].label.content = this.year;
    this.myChart.update();
  }

}
