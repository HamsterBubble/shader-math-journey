/**
 * ShaderRenderer - WebGL fragment shader renderer
 * Renders a fullscreen quad with custom fragment shader + uniforms
 */
export class ShaderRenderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!this.gl) throw new Error('WebGL not supported');

    this.program = null;
    this.uniformLocations = {};
    this.startTime = performance.now();
    this.mouse = [0, 0];
    this._animId = 0;

    this._initQuad();
    this._initEvents();

    // Auto-resize
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(canvas.parentElement || canvas);
    this._resize();
  }

  static VERT = `attribute vec2 a_position;
void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }`;

  /* ── geometry ── */
  _initQuad() {
    const gl = this.gl;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW);
  }

  /* ── compile ── */
  _compile(type, src) {
    const gl = this.gl;
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(log);
    }
    return s;
  }

  /**
   * Compile & link a new fragment shader.
   * @returns {{ ok: boolean, error?: string }}
   */
  setShader(fragSrc) {
    const gl = this.gl;
    if (this.program) gl.deleteProgram(this.program);

    try {
      const vs = this._compile(gl.VERTEX_SHADER, ShaderRenderer.VERT);
      const fs = this._compile(gl.FRAGMENT_SHADER, fragSrc);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog));
      }
      this.program = prog;
      gl.useProgram(prog);

      const pos = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      this.uniformLocations = {
        u_time: gl.getUniformLocation(prog, 'u_time'),
        u_resolution: gl.getUniformLocation(prog, 'u_resolution'),
        u_mouse: gl.getUniformLocation(prog, 'u_mouse'),
      };

      return { ok: true };
    } catch (e) {
      this.program = null;
      return { ok: false, error: e.message };
    }
  }

  /* ── resize ── */
  _resize() {
    const c = this.canvas;
    const dpr = Math.min(devicePixelRatio, 2);
    const w = c.clientWidth || c.parentElement?.clientWidth || 300;
    const h = c.clientHeight || c.parentElement?.clientHeight || 150;
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    this.gl.viewport(0, 0, c.width, c.height);
  }

  /* ── events ── */
  _initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse = [e.clientX - r.left, r.height - (e.clientY - r.top)];
    });
  }

  /* ── render loop ── */
  start() {
    const loop = () => {
      this._animId = requestAnimationFrame(loop);
      this._draw();
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this._animId);
  }

  _draw() {
    const gl = this.gl;
    if (!this.program) return;
    gl.useProgram(this.program);

    const t = (performance.now() - this.startTime) / 1000;
    const loc = this.uniformLocations;
    if (loc.u_time) gl.uniform1f(loc.u_time, t);
    if (loc.u_resolution) gl.uniform2f(loc.u_resolution, this.canvas.width, this.canvas.height);
    if (loc.u_mouse) gl.uniform2f(loc.u_mouse, this.mouse[0], this.mouse[1]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  destroy() {
    this.stop();
    this._ro?.disconnect();
    if (this.program) this.gl.deleteProgram(this.program);
  }
}
