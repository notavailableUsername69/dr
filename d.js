const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let isDrawing = false;
let undoStack = [];
let redoStack = [];

function startDrawing(event) {
  isDrawing = true;
  const { offsetX, offsetY } = event;
  context.beginPath();
  context.moveTo(offsetX, offsetY);
}

function draw(event) {
  if (!isDrawing) return;
  const { offsetX, offsetY } = event;
  context.lineTo(offsetX, offsetY);
  context.stroke();
}

function stopDrawing() {
  isDrawing = false;
  undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    context.putImageData(undoStack[undoStack.length - 1], 0, 0);
  }
}

function redo() {
  if (redoStack.length > 0) {
    context.putImageData(redoStack[redoStack.length - 1], 0, 0);
    undoStack.push(redoStack.pop());
  }
}

function reset() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
}

function changeColor(event) {
  context.strokeStyle = event.target.value;
}

function erase(event) {
  if (event.target.checked) {
    context.globalCompositeOperation = "destination-out";
  } else {
    context.globalCompositeOperation = "source-over";
  }
}

function changeBrushSize(event) {
  const brushSize = event.target.value;
  context.lineWidth = brushSize;
  context.strokeStyle = colorPicker.value;
}

function changeEraserSize(event) {
  const eraserSize = event.target.value;
  context.lineWidth = eraserSize;
  context.strokeStyle = "white";
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const resetButton = document.getElementById("resetButton");
const colorPicker = document.getElementById("colorPicker");
const eraseCheckbox = document.getElementById("eraseCheckbox");
const brushSizeInput = document.getElementById("brushSize");

const eraserSizeInput = document.getElementById("eraserSize");

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
resetButton.addEventListener("click", reset);
colorPicker.addEventListener("change", changeColor);
eraseCheckbox.addEventListener("change", erase);
brushSizeInput.addEventListener("input", changeBrushSize);
eraserSizeInput.addEventListener("input", changeEraserSize);