// Obtém elementos do DOM
const canvas = document.getElementById('canvas');
const brushColorInput = document.getElementById('brush-color');
const brushSizeInput = document.getElementById('brush-size');
const brushTypeSelect = document.getElementById('brush-type');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');

const ctx = canvas.getContext('2d');
let isDrawing = false;
let undoStack = [];
let redoStack = [];

// Configurações iniciais
ctx.lineWidth = brushSizeInput.value;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';



// Função para ajustar o tamanho do canvas
function setCanvasSize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  // Chamar a função para definir o tamanho inicial do canvas
  setCanvasSize();
  
  // Chamar a função sempre que o tamanho da janela for alterado
  window.addEventListener('resize', setCanvasSize);

// Função para iniciar o desenho
function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);

  // Save the initial state of the canvas onto the undoStack
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// Função para continuar o desenho
function draw(event) {
  if (!isDrawing) return;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.strokeStyle = brushColorInput.value;
  ctx.lineWidth = brushSizeInput.value;
  ctx.lineCap = brushTypeSelect.value;
  ctx.stroke();
}

// Função para parar o desenho
function stopDrawing() {
  if (!isDrawing) return;
  ctx.closePath();
  isDrawing = false;

  // Adicionar ação ao stack de desfazer
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

  // Chamar a função undo imediatamente após salvar o estado
  undo();
}

// Função para desfazer a última ação
function undo() {
  if (undoStack.length === 0) return;
  redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Save current state onto redoStack
  const imageData = undoStack.pop(); // Retrieve the last state from undoStack
  ctx.putImageData(imageData, 0, 0); // Restore the last state on the canvas
}

function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Save current state onto undoStack
  const imageData = redoStack.pop(); // Retrieve the last state from redoStack
  ctx.putImageData(imageData, 0, 0); // Restore the last state on the canvas
}
// Função para limpar o canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
}

// Função para salvar o desenho como uma imagem
function saveImage() {
  const image = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = image;
  link.download = 'desenho.png';
  link.click();
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveImage);


