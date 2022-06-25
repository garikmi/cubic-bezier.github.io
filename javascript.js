var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvasOffset = $("#canvas").offset();
offsetX = canvasOffset.left;
offsetY = canvasOffset.top;

var WIDTH = canvas.width,
    HEIGHT = canvas.height;

var horizontal_margins = 10,
    vertical_margins = 10;

var left_edge = horizontal_margins;
    right_edge = canvas.width - horizontal_margins;
    top_edge = vertical_margins;
    bottom_edge = canvas.height - vertical_margins;

var origin_x = horizontal_margins;
    origin_y = canvas.height - vertical_margins;
    ending_x = canvas.width - horizontal_margins;
    ending_y = vertical_margins;

var handle1_x = 0 + horizontal_margins;
    handle1_y = HEIGHT / 2;
    handle2_x = WIDTH - horizontal_margins;
    handle2_y = HEIGHT / 2;

var x_handle1,
    y_handle1;
var x_handle2,
    y_handle2;
calculateHandleCoords();

var circle_radius = 8;

var animation_speed;

var selected = null;

// Get value from slider and set animation speed
var slider = document.getElementById("range-slider");
var output = document.getElementById("range-label");
output.innerHTML = (parseFloat(slider.value)).toFixed(1);
animation_speed = parseFloat(slider.value);
setAnimation(`${animation_speed}s`, x_handle1, y_handle1, x_handle2, y_handle2);

slider.oninput = function() {
  output.innerHTML = (parseFloat(this.value)).toFixed(1);
  animation_speed = parseFloat(slider.value);
  setAnimation(`${animation_speed}s`, x_handle1, y_handle1, x_handle2, y_handle2);
}

// Detect if window is resized, update variables and redraw everything
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
  canvasOffset = $("#canvas").offset();
  offsetX = canvasOffset.left;
  offsetY = canvasOffset.top;
   
  left_edge = horizontal_margins;
  right_edge = canvas.width - horizontal_margins;
  top_edge = vertical_margins;
  bottom_edge = canvas.height - vertical_margins;

  origin_x = horizontal_margins;
  origin_y = canvas.height - vertical_margins;
  ending_x = canvas.width - horizontal_margins;
  ending_y = vertical_margins;

  calculateHandleCoords();

  drawStuff(); 
  setAnimation(`${animation_speed}s`, x_handle1, y_handle1, x_handle2, y_handle2);
  displayCoordinates(x_handle1, y_handle1, x_handle2, y_handle2);
}

resizeCanvas();

// Draw all element on the canvas
function drawStuff() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(10, "#e0def430", 2);

  ctx.beginPath();
  ctx.moveTo(origin_x, origin_y);
  ctx.bezierCurveTo(handle1_x, handle1_y, handle2_x, handle2_y, ending_x, ending_y);
  ctx.strokeStyle = "#eb6f92";
  ctx.lineWidth = 6;
  ctx.stroke();

  drawLine(origin_x, origin_y, handle1_x, handle1_y, "#eb6f92", 3);
  drawLine(ending_x, ending_y, handle2_x, handle2_y, "#eb6f92", 3);

  drawCircle(handle1_x, handle1_y, circle_radius, "#6e6a86", "#908caa", 1.5);
  drawCircle(handle2_x, handle2_y, circle_radius, "#6e6a86", "#908caa", 1.5);
}

// Detect click and disable text highlighting if handle is selected
document.onmousedown = disableselect;
function disableselect() {  
  if (selected != null) {
    return false  
  }
}

// Get mouse coordinates and detect which handle was clicked on
// Then enable mouse move detection
function handleMouseDown(e) {
  mouseX = parseInt(e.clientX - offsetX + window.pageXOffset);
  mouseY = parseInt(e.clientY - offsetY + window.pageYOffset);

  if (((mouseX < handle1_x + circle_radius) && (mouseX > handle1_x - circle_radius)) && ((mouseY < handle1_y + circle_radius) && (mouseY > handle1_y - circle_radius))) {
    selected = 1;
    document.getElementById("canvas").style.cursor = "grabbing";
  }
  if (((mouseX < handle2_x + circle_radius) && (mouseX > handle2_x - circle_radius)) && ((mouseY < handle2_y + circle_radius) && (mouseY > handle2_y - circle_radius))) {
    selected = 2;
    document.getElementById("canvas").style.cursor = "grabbing";
  }
  document.onmousemove = handleMouseMove;
}

// Deselect handles and disable mouse move detection to allow
// highlighting text
document.onmouseup = handleMouseUp;
function handleMouseUp() {
  selected = null;
  document.onmousemove = null;
  setAnimation(`${animation_speed}s`, x_handle1, y_handle1, x_handle2, y_handle2);
  document.getElementById("canvas").style.cursor = "default";
}

function handleMouseMove(event) {
  var x = event.pageX - offsetX;
  var y = event.pageY - offsetY;

  if (event.pageY < top_edge + offsetY) {
    y = top_edge;
  }
  if (event.pageX < left_edge + offsetX) {
    x = left_edge;
  }
  if (event.pageY > bottom_edge + offsetY) {
    y = bottom_edge;
  }
  if (event.pageX > right_edge + offsetX) {
    x = right_edge;
  }

  if (selected === 1) {
    handle1_x = x;
    handle1_y = y;
  }
  if (selected === 2) {
    handle2_x = x;
    handle2_y = y;
  }

  calculateHandleCoords();
  
  drawStuff();
  displayCoordinates(x_handle1, y_handle1, x_handle2, y_handle2);
}

// Listen for mouse clicks on canvas
$("#canvas").mousedown(function (e) {
  handleMouseDown(e);
});

// Calculating handle coords and displaying them
function calculateHandleCoords() {
  x_handle1 = `${((handle1_x - horizontal_margins) / (WIDTH - horizontal_margins * 2)).toFixed(2).replace(/[.,]00$/, "")}`;
  y_handle1 = `${(((-handle1_y + vertical_margins) + (WIDTH - vertical_margins * 2)) / (WIDTH - vertical_margins * 2)).toFixed(2).replace(/[.,]00$/, "")}`;

  x_handle2 = `${((handle2_x - horizontal_margins) / (WIDTH - horizontal_margins * 2)).toFixed(2).replace(/[.,]00$/, "")}`;
  y_handle2 = `${(((-handle2_y + vertical_margins) + (WIDTH - vertical_margins * 2)) / (WIDTH - vertical_margins * 2)).toFixed(2).replace(/[.,]00$/, "")}`;
}

function setAnimation(speed, x1, y1, x2, y2) {
  document.getElementById("animate").style.transitionDuration = speed;
  document.getElementById("animate").style.transitionTimingFunction = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

function displayCoordinates(x1, y1, x2, y2) {
  document.getElementById("output1").innerHTML = `cubic-bezier(${x1},${y1},${x2},${y2})`;
}

// Copy to clipboard
// Then set text to 'copied'
function copyToClipboard() {
  var value = `cubic-bezier(${x_handle1},${y_handle1},${x_handle2},${y_handle2})`;
  navigator.clipboard.writeText(value);
  document.getElementById("output1").innerHTML = "Copied!";
}

// Drawing
function drawLine(from_x, from_y, to_x, to_y, color, width) {
  ctx.beginPath();
  ctx.moveTo(from_x, from_y);
  ctx.lineTo(to_x, to_y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawCircle(x, y, radius, fill_color, stroke_color, width) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fill_color;
  ctx.fill();
  ctx.strokeStyle = stroke_color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawGrid(lines, color, width) {
  var spacing = (canvas.height - vertical_margins * 2) / lines;
  var count = 0;
  for (var i = 0; i < lines+1; i++) {
    drawLine(left_edge, top_edge + count, right_edge, top_edge + count, color, width);
    count += spacing;
  }

  spacing = (canvas.width - horizontal_margins * 2) / lines;
  count = 0;
  for (var i = 0; i < lines+1; i++) {
    drawLine(left_edge + count, top_edge, left_edge + count, bottom_edge, color, width);
    count += spacing;
  }
}

// Other functions
// Resets range slider
function resetTime() {
  document.getElementById("range-slider").value = "2";
  animation_speed = "2.0";
  output.innerHTML = (parseFloat(slider.value)).toFixed(1);
  setAnimation(`${animation_speed}s`, x_handle1, y_handle1, x_handle2, y_handle2);
}
