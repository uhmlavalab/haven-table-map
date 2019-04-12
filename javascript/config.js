function config() {
  buildPattern();

  function buildPattern() {

    const containerWidth = 22;
    const containerHeight = 100;
    const containerMargin = 0;
    const numberOfColumns = 4;
    const numberOfRows = 10;
    const markerPadding = 10;

    const imageArray = fillImageArray(numberOfColumns, numberOfRows);
    const board = new ConfigurationBoard(imageArray, numberOfRows, numberOfColumns, containerWidth, containerHeight);

    const container = document.getElementById('config');
    container.appendChild(board.table);

    container.style.position = 'absolute';
    container.style.width = containerWidth + 'vw';
    container.style.height = containerHeight + 'vh';
    container.style.top = 40 + 'vh';
    container.style.left = 1 + 'vw';
    imageArray.forEach(image => {
      image.element.style.width = 90 + '%';
      image.element.style.padding = 5 + '%';
      image.element.className = 'img-hor-vert';
    });

    setTimeout(function() {
      mapSpace(board, imageArray, 0);
    }, 500);



  }

  function fillImageArray(numberOfColumns, numberOfRows) {
    let array = [];
    for (let i = 0; i < (numberOfColumns * numberOfRows); i++) {
      array.push(new ConfigurationImage(i, `images/config-images/aruco-${i}.svg`));
    }
    return array;
  }

  function mapSpace(board, imageArray, i) {
    if (i < 24) {
      let image = imageArray[i];
      let square = board.tdArray[i];
      image.toggleImage();
      setTimeout(function() {
        image.toggleImage();
        mapSpace(board, imageArray, ++i);
      }, 1000);
   } else {
     board.showMap();
     return true;
    }
  }

}
