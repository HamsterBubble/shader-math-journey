import React, { memo, useEffect, useRef, useState } from 'react';

const WATER_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const DISPLAY_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const DISPLAY_FRAGMENT = `
precision mediump float;
uniform sampler2D uHeightTexture;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 cell = 1.0 / uResolution;
  float h = texture2D(uHeightTexture, vUv).x;
  float hx = texture2D(uHeightTexture, vUv + vec2(cell.x, 0.0)).x
    - texture2D(uHeightTexture, vUv - vec2(cell.x, 0.0)).x;
  float hy = texture2D(uHeightTexture, vUv + vec2(0.0, cell.y)).x
    - texture2D(uHeightTexture, vUv - vec2(0.0, cell.y)).x;
  vec3 n = normalize(vec3(hx * 18.0, hy * 18.0, 1.0));
  float light = pow(max(0.0, dot(n, normalize(vec3(0.4, 0.7, 1.0)))), 3.0);
  vec3 deep = vec3(0.015, 0.055, 0.11);
  vec3 crest = vec3(0.35, 0.78, 1.0);
  vec3 color = mix(deep, crest, clamp(h * 2.0 + 0.5, 0.0, 1.0));
  color += vec3(0.9, 0.97, 1.0) * light * 0.32;
  gl_FragColor = vec4(color, 1.0);
}
`;

function makeTarget(THREE, size) {
  return new THREE.WebGLRenderTarget(size, size, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  });
}

function CaseWaterPreview({ shaderCode, label, compileStatus }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastT: performance.now() });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let disposed = false;
    let removePointerMove = null;

    import('three').then((THREE) => {
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
      renderer.setClearColor(0x02050a, 1);

      const size = 256;
      const simScene = new THREE.Scene();
      const displayScene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quad = new THREE.PlaneGeometry(2, 2);
      const read = makeTarget(THREE, size);
      const write = makeTarget(THREE, size);
      const mouse = new THREE.Vector2(100, 100);
      const uniforms = {
        uCurrentTexture: { value: read.texture },
        uMousePosition: { value: mouse },
        uResolution: { value: new THREE.Vector2(size, size) },
        uMouseSize: { value: 0.0045 },
        uMouseIntensity: { value: 0.04 },
        uMouseProgress: { value: 0 },
        uViscosityConstant: { value: 0.89 },
      };

      const simMaterial = new THREE.ShaderMaterial({
        name: 'case-water-sim',
        vertexShader: WATER_VERTEX,
        fragmentShader: shaderCode,
        uniforms,
      });
      const simMesh = new THREE.Mesh(quad, simMaterial);
      simScene.add(simMesh);

      const displayMaterial = new THREE.ShaderMaterial({
        name: 'case-water-display',
        vertexShader: DISPLAY_VERTEX,
        fragmentShader: DISPLAY_FRAGMENT,
        uniforms: {
          uHeightTexture: { value: read.texture },
          uResolution: { value: new THREE.Vector2(size, size) },
        },
      });
      displayScene.add(new THREE.Mesh(quad.clone(), displayMaterial));

      const ro = new ResizeObserver(() => {
        const rect = canvas.parentElement?.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect?.width || 320));
        const h = Math.max(1, Math.floor(rect?.height || 180));
        renderer.setSize(w, h, false);
      });
      ro.observe(canvas.parentElement || canvas);

      const onPointerMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(1, rect.width);
        const y = (event.clientY - rect.top) / Math.max(1, rect.height);
        mouse.set(x - 0.5, 1.0 - y - 0.5);
        uniforms.uMouseProgress.value = 1.0;
      };
      canvas.addEventListener('pointermove', onPointerMove);
      removePointerMove = () => canvas.removeEventListener('pointermove', onPointerMove);

      stateRef.current = {
        renderer,
        simMaterial,
        displayMaterial,
        read,
        write,
        uniforms,
        simScene,
        displayScene,
        camera,
        ro,
        quad,
        raf: 0,
      };

      const clearTarget = (target) => {
        const prev = renderer.getRenderTarget();
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.setRenderTarget(prev);
      };
      clearTarget(read);
      clearTarget(write);

      const loop = () => {
        const state = stateRef.current;
        if (!state) return;
        state.raf = requestAnimationFrame(loop);
        state.uniforms.uMouseProgress.value *= 0.92;

        state.uniforms.uCurrentTexture.value = state.read.texture;
        state.renderer.setRenderTarget(state.write);
        state.renderer.render(state.simScene, state.camera);
        state.renderer.setRenderTarget(null);

        const nextRead = state.write;
        state.write = state.read;
        state.read = nextRead;
        state.displayMaterial.uniforms.uHeightTexture.value = state.read.texture;
        state.renderer.render(state.displayScene, state.camera);

        fpsRef.current.frames++;
        const now = performance.now();
        if (now - fpsRef.current.lastT >= 1000) {
          setFps(fpsRef.current.frames);
          fpsRef.current.frames = 0;
          fpsRef.current.lastT = now;
        }
      };
      loop();
    });

    return () => {
      disposed = true;
      const state = stateRef.current;
      if (state) {
        cancelAnimationFrame(state.raf);
        state.ro.disconnect();
        state.read.dispose();
        state.write.dispose();
        state.simMaterial.dispose();
        state.displayMaterial.dispose();
        state.quad.dispose();
        state.renderer.dispose();
      }
      removePointerMove?.();
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.simMaterial.fragmentShader = shaderCode;
    state.simMaterial.needsUpdate = true;
    state.uniforms.uMouseProgress.value = 1.0;
  }, [shaderCode]);

  const showError = compileStatus && !compileStatus.ok;

  return (
    <div className="case-preview-pane">
      <div className="case-preview-label">{label}</div>
      <div className="preview case-preview-canvas">
        <canvas ref={canvasRef} />
        <div className={`status ${showError ? 'err' : 'ok'}`}>
          <span className="dot" />
          <span>{showError ? '编译错误' : '运行中'}</span>
        </div>
        <div className="fps">{fps} fps</div>
        {showError && compileStatus.error && (
          <div className="error-bar show">{compileStatus.error}</div>
        )}
      </div>
    </div>
  );
}

export default memo(CaseWaterPreview);
