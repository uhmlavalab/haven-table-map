
class BatteryBar {

  constructor(barDiv, dataUrl, year, colors) {
    this.barDiv = document.getElementById(barDiv);
    this.year = year;
    this.color = colors['Battery'];
    this.chartData = null;
    this.scenario = 'postapril'
    d3.csv(dataUrl, (data) => {
      this.data = data;
      this.createChart();
    });
  }

  createChart() {
    let newData = [];
    const powerVals = [];
    this.data.forEach(element => {
      powerVals.push(element[`${this.scenario}_power`]);
      if (element.year == this.year) {
        let power = element[`${this.scenario}_power`];
        const utilization = element[`${this.scenario}_utilization`] * power;
        // power -= utilization;
        newData = [power, utilization]
      }
    });
    const max = Math.max(...powerVals);
    this.chartData = newData;
    this.ctx = this.barDiv.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: this.chartData,
      data: {
        labels: ['Power', 'Utilization'],
        datasets: [{
          label: 'Battery Utilization',
          data: this.chartData,
          backgroundColor: [this.color, '#994E95'],
          borderColor: [
            'rgba(255,255,255,1)',
            'rgba(255, 255, 255, 1)',
          ],
          borderWidth: 4
        }]
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            stacked: true,
            display: true,
            ticks: {
              max: max,
              min: 0,
              fontSize: 100,
              fontStyle: 'bold',
              fontColor: "white",
            },
            gridLines: {
              display: true,
              color: 'white',
              lineWidth: 7,
              drawBorder: true,
              zeroLineColor: 'white'
            },
          }],
        }
      }
    });
    this.updateChart(this.year, this.scenario);
  }

  updateChart(year, scenario) {
    this.year = year;
    this.scenario = scenario;
    let newData = [];
    const powerVals = [];
    this.data.forEach(element => {
      powerVals.push(element[`${this.scenario}_power`]);
      if (element.year == this.year) {
        let power = element[`${this.scenario}_power`];
        const utilization = element[`${this.scenario}_utilization`] * power;
        // power -= utilization;
        newData = [power, utilization]
      }
    });
    const max = Math.max(...powerVals);
    this.chartData = newData;
    this.myChart.data.labels = ['Power', 'Utilization'];
    this.myChart.data.datasets[0].data = this.chartData;
    this.myChart.options.scales.yAxes[0].ticks.max = max;
    this.myChart.update();
  }

  hideElement() {
    this.barDiv.style.display = 'none';
  }

  showElement() {
    this.barDiv.style.display = 'block';
  }

}
