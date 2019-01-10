
class GenerationPie {

  constructor(pieDiv, dataUrl, year) {
    this.color = d3.scale.category10();
    this.pieDiv = document.getElementById(pieDiv);
    this.year = year;
    this.chartData = null;
    d3.csv(dataUrl, (data) => {
      this.data = data;
      this.createChart();
    });
  }

  createChart() {
    const newData = [];
    this.data.forEach(element => {
      if (element.year == this.year) {
        newData.push({ 'label': element.technology, 'postapril': element.postapril, 'e3genmod': element.e3genmod });
      }
    });
    this.chartData = newData;
    const labels = [];
    const values = [];
    this.chartData.forEach(el => {
      labels.push(el.label);
      values.push(el.postapril)
    })
    this.ctx = this.pieDiv.getContext('2d');
    this.myChart = new Chart(this.ctx , {
      type: 'pie',
      options: {
        legend: {
           display: false,
           labels: {
             fontColor: "white",
             fontStyle: "bold",
             fontSize: 14,
           }
         },
         responsive: false,
         plugins: {
           labels: [{
             render: 'label',
             position: 'border',
             fontSize: 10,
             overlap: false,
             fontStyle: 'bold',
             fontColor: 'white'
           },
           {
             render: 'percentage',
             fontColor: 'white',
             fontSize: 8,
             fontStyle: 'bold',
             overlap: false,
           }]
         },
      },
      data: {
        labels: labels,
        datasets: [{
          label: 'Generation MWh',
          data: values,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgba(255,255,255,1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          borderWidth: 4
        }]
      },
    });
  }

  updateChart(year, scenario) {
    this.year = year;
    const newData = [];
    this.data.forEach(element => {
      if (element.year == this.year) {
        newData.push({ 'label': element.technology, 'value': element[scenario.toLowerCase()] });
      }
    });
    this.chartData = newData;
    const labels = [];
    const values = [];
    this.chartData.forEach(el => {
      labels.push(el.label);
      values.push(el.value)
    })
    this.myChart.data.labels = labels;
    this.myChart.data.datasets[0].data = values;
    this.myChart.update();
  }

}
