var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvasOffset = $("#canvas").offset();
offsetX = canvasOffset.left;
offsetY = canvasOffset.top;

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

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

var circle_radius = 8;

var selected = null;

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // WIDTH = canvas.width;
  // HEIGHT = canvas.height;
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
 
  // handle1_x = 0 + horizontal_margins;
  // handle1_y = HEIGHT / 2;
  // handle2_x = WIDTH - horizontal_margins;
  // handle2_y = HEIGHT / 2;

  // handle1_x = 0 + horizontal_margins;
  // handle1_y = canvas.height / 2;
  // handle2_x = canvas.width - horizontal_margins;
  // handle2_y = canvas.height / 2;

  drawStuff(); 
}

resizeCanvas();


function drawStuff() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(10, "#e0def4", 1);

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

  var handle1 = `${((handle1_x - horizontal_margins) / (WIDTH - horizontal_margins * 2)).toFixed(2).replace(/[.,]00$/, "")},${(((-handle1_y + vertical_margins) + (WIDTH - vertical_margins * 2)) / (WIDTH - vertical_margins * 2)).toFixed(2).replace(/[.,]00$/, "")}`,
      handle2 = `${((handle2_x - horizontal_margins) / (WIDTH - horizontal_margins * 2)).toFixed(2).replace(/[.,]00$/, "")},${(((-handle2_y + vertical_margins) + (WIDTH - vertical_margins * 2)) / (WIDTH - vertical_margins * 2)).toFixed(2).replace(/[.,]00$/, "")}`;

  document.getElementById("output1").innerHTML = `cubic-bezier(${handle1},${handle2})`;
  // document.getElementById("output2").innerHTML = `1s cubic-bezier(${handle1},${handle2})`;
  // document.getElementById("output3").innerHTML = `${handle1},${handle2}`;
}

// TODO: Add clipboard support
// function copyToClipboard() {
//   var value = "this is a tests";
//   navigator.clipboard.writeText(value);
//   alert("Copied the text: " + value);
// }

document.onmousedown = disableselect;
function disableselect() {  
  if (selected != null) {
    return false  
  }
}
function handleMouseDown(e) {
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  if (((mouseX < handle1_x + circle_radius) && (mouseX > handle1_x - circle_radius)) && ((mouseY < handle1_y + circle_radius) && (mouseY > handle1_y - circle_radius))) {
    selected = 1;
  }
  if (((mouseX < handle2_x + circle_radius) && (mouseX > handle2_x - circle_radius)) && ((mouseY < handle2_y + circle_radius) && (mouseY > handle2_y - circle_radius))) {
    selected = 2;
  }
  document.onmousemove = handleMouseMove;
}

document.onmouseup = handleMouseUp;
function handleMouseUp(event) {
  selected = null;
  document.onmousemove = null;
}

// document.onmousemove = handleMouseMove;
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
  
  drawStuff();
}

$("#canvas").mousedown(function (e) {
  handleMouseDown(e);
});

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
