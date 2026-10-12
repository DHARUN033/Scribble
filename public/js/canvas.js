// High-Performance Drawing Canvas Engine with Bézier Smoothing & Flood Fill

export class DrawingBoard {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.isInteractive = options.isInteractive !== false;
    this.onStroke = options.onStroke || null;

    // Fixed virtual resolution for pixel-perfect cross-device parity
    this.virtualWidth = 800;
    this.virtualHeight = 600;
    this.canvas.width = this.virtualWidth;
    this.canvas.height = this.virtualHeight;

    // Drawing state
    this.isDrawing = false;
    this.currentTool = 'brush'; // 'brush', 'eraser', 'fill'
    this.currentColor = '#000000';
    this.currentSize = 8;
    this.currentStrokePoints = [];
    this.history = []; // Array of canvas actions

    this.initCanvasBackground();
    this.bindEvents(); // Always bind listeners once so setInteractive can enable/disable drawing
  }

  initCanvasBackground() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
  }

  setInteractive(val) {
    this.isInteractive = !!val;
    this.canvas.style.cursor = this.isInteractive ? 'crosshair' : 'default';
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
    if (this.currentTool === 'eraser') {
      this.currentTool = 'brush';
    }
  }

  setSize(size) {
    this.currentSize = parseInt(size, 10);
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = rect.width ? this.virtualWidth / rect.width : 1;
    const scaleY = rect.height ? this.virtualHeight / rect.height : 1;

    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY)
    };
  }

  bindEvents() {
    const startHandler = (e) => {
      if (!this.isInteractive) return;
      e.preventDefault();
      const pos = this.getPointerPos(e);

      if (this.currentTool === 'fill') {
        this.floodFill(pos.x, pos.y, this.currentColor);
        const strokeData = {
          type: 'fill',
          x: pos.x,
          y: pos.y,
          color: this.currentColor
        };
        this.history.push(strokeData);
        if (this.onStroke) this.onStroke(strokeData);
        return;
      }

      this.isDrawing = true;
      this.currentStrokePoints = [pos];

      const strokeData = {
        type: 'start',
        tool: this.currentTool,
        color: this.currentTool === 'eraser' ? '#ffffff' : this.currentColor,
        size: this.currentSize,
        x: pos.x,
        y: pos.y
      };

      this.applyStroke(strokeData);
      if (this.onStroke) this.onStroke(strokeData);
    };

    const moveHandler = (e) => {
      if (!this.isDrawing || !this.isInteractive) return;
      e.preventDefault();
      const pos = this.getPointerPos(e);
      this.currentStrokePoints.push(pos);

      const strokeData = {
        type: 'draw',
        tool: this.currentTool,
        color: this.currentTool === 'eraser' ? '#ffffff' : this.currentColor,
        size: this.currentSize,
        x: pos.x,
        y: pos.y
      };

      this.applyStroke(strokeData);
      if (this.onStroke) this.onStroke(strokeData);
    };

    const endHandler = (e) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.currentStrokePoints = [];
      this.lastPoint = null;
    };

    // Mouse
    this.canvas.addEventListener('mousedown', startHandler);
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', endHandler);

    // Touch
    this.canvas.addEventListener('touchstart', startHandler, { passive: false });
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('touchend', endHandler);
  }

  undo() {
    if (this.history.length > 0) {
      this.history.pop();
      this.initCanvasBackground();
      const replay = [...this.history];
      this.history = [];
      replay.forEach(s => this.applyStroke(s));
    }
  }

  applyStroke(stroke) {
    if (!stroke) return;
    this.history.push(stroke);

    if (stroke.type === 'start') {
      this.ctx.beginPath();
      this.ctx.fillStyle = stroke.color;
      this.ctx.arc(stroke.x, stroke.y, stroke.size / 2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.strokeStyle = stroke.color;
      this.ctx.fillStyle = stroke.color;
      this.ctx.lineWidth = stroke.size;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.moveTo(stroke.x, stroke.y);
      this.lastPoint = { x: stroke.x, y: stroke.y };
    } else if (stroke.type === 'draw') {
      if (!this.lastPoint) {
        this.lastPoint = { x: stroke.x, y: stroke.y };
      }
      this.ctx.beginPath();
      this.ctx.strokeStyle = stroke.color;
      this.ctx.lineWidth = stroke.size;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Quadratic Bézier curve smoothing
      const midPoint = {
        x: (this.lastPoint.x + stroke.x) / 2,
        y: (this.lastPoint.y + stroke.y) / 2
      };
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.quadraticCurveTo(this.lastPoint.x, this.lastPoint.y, midPoint.x, midPoint.y);
      this.ctx.lineTo(stroke.x, stroke.y);
      this.ctx.stroke();

      this.lastPoint = { x: stroke.x, y: stroke.y };
    } else if (stroke.type === 'fill') {
      this.floodFill(stroke.x, stroke.y, stroke.color);
    } else if (stroke.type === 'clear') {
      this.initCanvasBackground();
    } else if (stroke.type === 'bomb') {
      this.animateBomb();
    }
  }

  // Scanline Flood Fill Algorithm
  floodFill(startX, startY, fillHexColor) {
    const imgData = this.ctx.getImageData(0, 0, this.virtualWidth, this.virtualHeight);
    const data = imgData.data;

    const startPos = (startY * this.virtualWidth + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    // Convert Hex to RGBA
    const fillR = parseInt(fillHexColor.slice(1, 3), 16);
    const fillG = parseInt(fillHexColor.slice(3, 5), 16);
    const fillB = parseInt(fillHexColor.slice(5, 7), 16);
    const fillA = 255;

    // If clicking same color, return
    if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) {
      return;
    }

    const colorMatch = (pos) => {
      return (
        Math.abs(data[pos] - startR) < 25 &&
        Math.abs(data[pos + 1] - startG) < 25 &&
        Math.abs(data[pos + 2] - startB) < 25 &&
        Math.abs(data[pos + 3] - startA) < 25
      );
    };

    const pixelStack = [[startX, startY]];
    const width = this.virtualWidth;
    const height = this.virtualHeight;

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * width + x) * 4;
      while (y >= 0 && colorMatch(pixelPos)) {
        y--;
        pixelPos -= width * 4;
      }
      pixelPos += width * 4;
      y++;

      let reachLeft = false;
      let reachRight = false;

      while (y < height && colorMatch(pixelPos)) {
        data[pixelPos] = fillR;
        data[pixelPos + 1] = fillG;
        data[pixelPos + 2] = fillB;
        data[pixelPos + 3] = fillA;

        if (x > 0) {
          if (colorMatch(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < width - 1) {
          if (colorMatch(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        y++;
        pixelPos += width * 4;
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }

  animateBomb() {
    this.canvas.classList.add('bomb-shake');
    setTimeout(() => {
      this.initCanvasBackground();
      this.canvas.classList.remove('bomb-shake');
    }, 400);
  }

  reset() {
    this.initCanvasBackground();
    this.history = [];
    this.currentStrokePoints = [];
    this.lastPoint = null;
  }

  clear() {
    this.reset();
    if (this.onStroke) {
      this.onStroke({ type: 'clear' });
    }
  }

  loadStrokes(strokes) {
    this.reset();
    if (Array.isArray(strokes)) {
      strokes.forEach(s => this.applyStroke(s));
    }
  }
}
