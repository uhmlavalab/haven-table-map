class ConfigurationImage {

  constructor(id, src) {

    this.tableCorners = [];
    this.camCorners = [];
    this.hidden = true;
    this.id = id;
    this.imageSrc = src;
    this.element = this.makeImage(this.imageSrc);
    this.toggleImage();
    this.maxTime = 50;
    this.startTime = 0;
    this.resetTimer();
  }

  makeImage(src) {
    let image = document.createElement('img');
    image.src = src;
    return image;
  }

  setTableCorners(corners) {
    this.tableCorners[0] = {
      x: corners.left,
      y: corners.top
    };
    this.tableCorners[1] = {
      x: corners.right,
      y: corners.top
    };
    this.tableCorners[2] = {
      x: corners.right,
      y: corners.bottom
    };
    this.tableCorners[3] = {
      x: corners.left,
      y: corners.bottom
    };
  }

  setCamCorners(corners) {
    this.camCorners[0] = {
      x: corners.left,
      y: corners.top
    };
    this.cameCorners[1] = {
      x: corners.right,
      y: corners.top
    };
    this.camCorners[2] = {
      x: corners.right,
      y: corners.bottom
    };
    this.camCorners[3] = {
      x: corners.left,
      y: corners.bottom
    };
  }

  toggleImage() {
    let opacity = this.hidden ? 0 : 1;
    this.element.style.opacity = opacity;
    this.hidden = !this.hidden;
  }

  rotateImage() {
    this.element.style.transform = 'rotate(90deg)';
  }

  detected() {
    return _.contains(configArray, this.id) ? true : false;
  }


  resetTimer() {
    const dateTime = new Date();
    this.startTime = dateTime.getTime();
  }

  checkTimer() {
    let curTime = new Date();
    console.log(curTime.getTime() - this.startTime);
    return (curTime.getTime() - this.startTime) > this.maxTime ? true : false;
  }
}
