class ConfigurationBoard {

    constructor(imageArray, rows, columns, width, height) {
      this.rows = rows;
      this.columns = columns;
      this.width = width;
      this.height - height;
      this.tdArray = [];
      this.table = this.createTable(imageArray, rows, columns);
      this.tdWidth = this.width/this.columns;
    }

    createTable(imageArray, rows, columns) {
      const table = document.createElement('table');
      table.style.width = 100 + '%';

      for (let i = 0; i < rows; i++) {
        let row = document.createElement('tr');
        table.appendChild(row);
        for (let j = 0; j < columns; j++) {
          let column = document.createElement('td');
          column.style.width = 25 + '%';
          row.appendChild(column);
          column.appendChild(imageArray[(i * columns) + j].element);
          this.tdArray.push(column);
          //this.blackTd(column);
        }
      }
      return table;
    }

    showMap() {
      for (let i = 0; i < this.tdArray.length; i++) {
        if (_.contains(configArray, i)) {
          this.greenTd(this.tdArray[i]);
        }
      }
    }

    blackTd(element) {
      element.style.backgroundColor = '#000000';
    }

    whiteTd(element) {
      element.style.backgroundColor = '#FFFFFF';
    }

    greenTd(element) {
      element.style.backgroundColor = 'GREEN';
    }



}
