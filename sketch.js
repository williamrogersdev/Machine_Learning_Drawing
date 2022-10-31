let sketchRNN;
let currentStroke;
let x, y;
let nextPen = "down";
let seedPath = [];
let personDrawing = false;
//function that preloads the model
function preload() {
  sketchRNN = ml5.sketchRNN("cat");
}

function startDrawing() {
  personDrawing = true;
  //start drawing wherever mouse is
  x = mouseX;
  y = mouseY;
}

//start generating the drawing
function sketchRNNStart() {
  personDrawing = false;
  sketchRNN.generate(seedPath, gotStrokePath);
}
//called when page is loaded
function setup() {
  let canvas = createCanvas(500, 500);
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(sketchRNNStart);

  background(255);
  //
  //   sketchRNN.generate(gotStrokePath);
  console.log("model loaded");
}

//foundation
//recurent neural network
//function will get back a vector path, a change in x, a change in y, and whether the pen was down or up
//find the next path/vector

function gotStrokePath(error, StrokePath) {
  console.log(StrokePath);
  currentStroke = StrokePath;
}
//animation loop
function draw() {
  stroke(0);
  strokeWeight(4);
  //find out where is the current pen

  //if person is drawing
  if (personDrawing) {
    //collect states
    let strokePath = {
      //p5 js vars that have current mouse postions and previous mouse postiions
      dx: mouseX - pmouseX,
      dy: mouseY - pmouseY,
      pen: "down",
    };
    line(x, y, x + strokePath.dx, y + strokePath.dy);
    x += strokePath.dx;
    y += strokePath.dy;

    seedPath.push(strokePath);
  }

  if (currentStroke) {
    if (nextPen == "end") {
      noLoop();
      return;
    }

    if (nextPen == "down") {
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    //clear var
    currentStroke = null;
    //recursivly call function
    sketchRNN.generate(gotStrokePath);
  }
}
