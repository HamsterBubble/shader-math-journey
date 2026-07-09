/**
 * Canvas 2D function plotter (GeoGebra-like axes + curves).
 */

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function mapX(x, view, w) {
  return ((x - view.xMin) / (view.xMax - view.xMin)) * w;
}

function mapY(y, view, h) {
  return ((view.yMax - y) / (view.yMax - view.yMin)) * h;
}

function niceStep(range, targetTicks = 10) {
  const rough = range / targetTicks;
  const pow = 10 ** Math.floor(Math.log10(Math.max(rough, 1e-12)));
  const n = rough / pow;
  let step;
  if (n < 1.5) step = 1;
  else if (n < 3.5) step = 2;
  else if (n < 7.5) step = 5;
  else step = 10;
  return step * pow;
}

function formatTick(v) {
  if (Math.abs(v) < 1e-10) return '0';
  const abs = Math.abs(v);
  if (abs >= 1000 || (abs < 0.01 && abs > 0)) return v.toExponential(1);
  const s = Number(v.toFixed(6)).toString();
  return s;
}

function drawGrid(ctx, w, h, view) {
  const xStep = niceStep(view.xMax - view.xMin);
  const yStep = niceStep(view.yMax - view.yMin);

  ctx.save();
  ctx.lineWidth = 1;

  // minor-ish grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  const x0 = Math.ceil(view.xMin / xStep) * xStep;
  for (let x = x0; x <= view.xMax + 1e-9; x += xStep) {
    const px = mapX(x, view, w);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, h);
    ctx.stroke();
  }
  const y0 = Math.ceil(view.yMin / yStep) * yStep;
  for (let y = y0; y <= view.yMax + 1e-9; y += yStep) {
    const py = mapY(y, view, h);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }

  // axes
  ctx.strokeStyle = 'rgba(230,237,243,0.35)';
  ctx.lineWidth = 1.5;
  const ax = mapX(0, view, w);
  const ay = mapY(0, view, h);
  if (ax >= 0 && ax <= w) {
    ctx.beginPath();
    ctx.moveTo(ax, 0);
    ctx.lineTo(ax, h);
    ctx.stroke();
  }
  if (ay >= 0 && ay <= h) {
    ctx.beginPath();
    ctx.moveTo(0, ay);
    ctx.lineTo(w, ay);
    ctx.stroke();
  }

  // labels
  ctx.fillStyle = 'rgba(139,148,158,0.9)';
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let x = x0; x <= view.xMax + 1e-9; x += xStep) {
    if (Math.abs(x) < xStep * 0.01) continue;
    const px = mapX(x, view, w);
    const ly = Math.min(h - 14, Math.max(4, ay + 4));
    ctx.fillText(formatTick(x), px, ly);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = y0; y <= view.yMax + 1e-9; y += yStep) {
    if (Math.abs(y) < yStep * 0.01) continue;
    const py = mapY(y, view, h);
    const lx = Math.min(w - 4, Math.max(28, ax - 6));
    ctx.fillText(formatTick(y), lx, py);
  }
  ctx.restore();
}

function sampleCurve(evalFn, view, w) {
  const points = [];
  const steps = Math.max(400, Math.floor(w * 2));
  const dx = (view.xMax - view.xMin) / steps;
  for (let i = 0; i <= steps; i += 1) {
    const x = view.xMin + dx * i;
    const y = evalFn(x);
    points.push({ x, y, valid: Number.isFinite(y) });
  }
  return points;
}

function drawCurve(ctx, w, h, view, points, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let drawing = false;
  let prevY = null;
  const yRange = view.yMax - view.yMin;
  const jump = yRange * 2;

  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    if (!p.valid) {
      drawing = false;
      prevY = null;
      continue;
    }
    // clip far outside with discontinuity break
    if (prevY != null && Math.abs(p.y - prevY) > jump) {
      drawing = false;
    }
    const px = mapX(p.x, view, w);
    const py = mapY(p.y, view, h);
    if (!drawing) {
      ctx.beginPath();
      ctx.moveTo(px, py);
      drawing = true;
    } else {
      ctx.lineTo(px, py);
    }
    prevY = p.y;
  }
  if (drawing) ctx.stroke();
  ctx.restore();
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ view: object, curves: Array<{ eval: Function, color: string, visible?: boolean }> }} options
 */
export function renderGraph(canvas, { view, curves }) {
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);

  // background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, w, h);

  drawGrid(ctx, w, h, view);

  for (const curve of curves) {
    if (curve.visible === false || !curve.eval) continue;
    const points = sampleCurve(curve.eval, view, w);
    drawCurve(ctx, w, h, view, points, curve.color || '#58a6ff');
  }
}

export function screenToWorld(px, py, view, w, h) {
  return {
    x: view.xMin + (px / w) * (view.xMax - view.xMin),
    y: view.yMax - (py / h) * (view.yMax - view.yMin),
  };
}

export function panView(view, dxPx, dyPx, w, h) {
  const xSpan = view.xMax - view.xMin;
  const ySpan = view.yMax - view.yMin;
  const dx = -(dxPx / w) * xSpan;
  const dy = (dyPx / h) * ySpan;
  return {
    xMin: view.xMin + dx,
    xMax: view.xMax + dx,
    yMin: view.yMin + dy,
    yMax: view.yMax + dy,
  };
}

export function zoomView(view, factor, centerX, centerY) {
  const xMin = centerX + (view.xMin - centerX) * factor;
  const xMax = centerX + (view.xMax - centerX) * factor;
  const yMin = centerY + (view.yMin - centerY) * factor;
  const yMax = centerY + (view.yMax - centerY) * factor;
  // prevent degenerate zoom
  if (xMax - xMin < 1e-6 || yMax - yMin < 1e-6) return view;
  if (xMax - xMin > 1e6 || yMax - yMin > 1e6) return view;
  return { xMin, xMax, yMin, yMax };
}
