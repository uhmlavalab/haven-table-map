function showElement(e) {
  e.style.display = 'block';
}

function showElementInline(e) {
  e.style.display = 'inline-block';
}

function showGroupInline(array) {
  _.map(array, e => showElementInline(e));
}

function hideElement(e) {
  e.style.display = 'none';
}

function setOpacity(e, value) {
  e.style.opacity = value;
}
function addClass(e, className) {
  e.className = className;
}

function setWidthByPercentage(e, width) {
  e.style.width = width + '%';
}

function setId(e, id) {
  e.id = id;
}

function appendElement(child, parent) {
  parent.appendChild(child);
}

function setText(e, text) {
  e.innerHTML = text;
}

function setImgSrc(e, path) {
  e.src = path;
}

function createElement(tag, classN, id, parent) {
  let e = document.createElement(tag);
  e.className = classN;
  e.id = id;
  appendElement(e, parent);
  return e;
}

function getElement(id) {
  return document.getElementById(id);
}

function updateElementStyle(e, styleArray) {
  _.each(styleArray, element => _.map(element, (value, key) => e.style[key] = value));
}

function removeChild(e, child) {
  e.removeChild(child);
}

function removeAllChildren(e) {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
}

function hideGroup(array) {
  _.map(array, e => hideElement(e));
}

function showGroup(array) {
  _.map(array, e => showElement(e));
}

function lightUpElement(e) {
  e.style.backgroundColor = 'white';
  e.style.color ='black';
}

function greyOutElement(e) {
  e.style.backgroundColor = 'black';
  e.style.color ='white';
}
