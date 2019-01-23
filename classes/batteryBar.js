
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
        console.log(element);
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
              suggestedMin: max,
              beginAtZero: true,
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: "white",
            },
            stacked: true,
            display: true,
            gridLines: {
              display: true,
              color: "#FFFFFF",
            },
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
        console.log(element);
        let power = element[`${this.scenario}_power`];
        const utilization = element[`${this.scenario}_utilization`] * power;
        power -= utilization;
        newData = [{ x: 'Power', y: power }, { x: 'Utilization', y: utilization }]
      }
    });
    const max = Math.max(...powerVals);
    this.chartData = newData;
    this.myChart.data = this.chartData;
    this.options.scales.yAxes[0].suggestedMin = max;
    this.myChart.update();
  }

}
