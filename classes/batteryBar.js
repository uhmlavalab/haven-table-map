
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
        power -= utilization;
        newData = [{ x: 'Power', y: power }, { x: 'Utilization', y: utilization }]
      }
    });
    const max = Math.max(...powerVals);
    this.chartData = newData;
    this.ctx = this.barDiv.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: this.chartData,
      data: {
        labels: [this.chartData[0].x, this.chartData[1].x],
        datasets: [{
          label: 'Battery Utilization',
          data: [this.chartData[0].y, this.chartData[1].y],
          backgroundColor: [this.color, this.color],
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
          labels: {
            fontColor: "white",
            fontStyle: "bold",
            fontSize: 14,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              max: max,
              beginAtZero: true,
              fontSize: 40,
              fontStyle: 'bold',
              fontColor: "white",
            },
            stacked: true,
            display: true,
            gridLines: {
              display: true,
              color: "#FFFFFF",
            },
          }],
          xAxes: [{
            stacked: true,
          }]
        }
      }
    });
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
        power -= utilization;
        newData = [{ x: 'Power', y: power }, { x: 'Utilization', y: utilization }]
      }
    });
    const max = Math.max(...powerVals);
    this.chartData = newData;
    this.myChart.data.labels = [this.chartData[0].x, this.chartData[1].x];
    this.myChart.data.datasets[0].data = [this.chartData[0].y, this.chartData[1].y];
    this.myChart.options.scales.yAxes[0].ticks.max = max;
    this.myChart.update();
  }

}
