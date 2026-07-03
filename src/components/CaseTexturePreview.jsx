import React, { memo, useEffect, useRef, useState } from 'react';

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

function CaseTexturePreview({ shaderCode, label, compileStatus, step }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastT: performance.now() });
  const textureAssets = step?.previewAssets?.textures || {
    uCover: step?.previewAssets?.cover || step?.previewAssets?.texture || '/cases/dracarys/images/share.jpg',
  };
  const textureKey = JSON.stringify(textureAssets);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let disposed = false;
    let removePointerMove = null;

    import('three').then((THREE) => {
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setClearColor(0x050608, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mouse = new THREE.Vector2(0.5, 0.5);
      const resolution = new THREE.Vector2(1, 1);
      const placeholder = new THREE.DataTexture(new Uint8Array([6, 8, 12, 255]), 1, 1, THREE.RGBAFormat);
      placeholder.needsUpdate = true;

      const uniforms = {
        uCover: { value: placeholder },
        uTexture: { value: placeholder },
        uInput: { value: placeholder },
        uIceNormalTxt: { value: placeholder },
        uIceTxt: { value: placeholder },
        uIceDensityTxt: { value: placeholder },
        uNoiseTxt: { value: placeholder },
        uLogoNormals: { value: placeholder },
        uLogoMask: { value: placeholder },
        uResolution: { value: resolution },
        uMouse: { value: mouse },
        uMousePosition: { value: new THREE.Vector2(0, 1) },
        uLogoSpecs: { value: new THREE.Vector3(0, -0.15, 1.2) },
        uBlendColor: { value: new THREE.Color('#0c1024') },
        uLogoDisplacement: { value: 0.34 },
        uLogoBrightness: { value: 0.63 },
        uSceneProgress: { value: 0 },
        uMaskProgress: { value: 0 },
        uMaskProgress2: { value: 1 },
        uIsMobile: { value: 0 },
        uTime: { value: 0 },
      };

      const material = new THREE.ShaderMaterial({
        name: 'case-texture-fragment',
        vertexShader: VERTEX_SHADER,
        fragmentShader: shaderCode,
        uniforms,
      });
      scene.add(new THREE.Mesh(geometry, material));

      const loader = new THREE.TextureLoader();
      const loadedTextures = [];
      Object.entries(textureAssets).forEach(([uniformName, url]) => {
        loader.load(url, (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = /(diffuse|cover|texture|input|lut)/i.test(uniformName) ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          texture.wrapS = /logo/i.test(uniformName) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
          texture.wrapT = /logo/i.test(uniformName) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
          texture.needsUpdate = true;
          loadedTextures.push(texture);
          if (uniforms[uniformName]) {
            uniforms[uniformName].value = texture;
          }
          if (uniformName === 'uCover') {
            uniforms.uTexture.value = texture;
            uniforms.uInput.value = texture;
          }
        });
      });

      const ro = new ResizeObserver(() => {
        const rect = canvas.parentElement?.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect?.width || 320));
        const h = Math.max(1, Math.floor(rect?.height || 180));
        renderer.setSize(w, h, false);
        resolution.set(w, h);
      });
      ro.observe(canvas.parentElement || canvas);

      const onPointerMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(1, rect.width);
        const y = (event.clientY - rect.top) / Math.max(1, rect.height);
        mouse.set(x, 1.0 - y);
      };
      canvas.addEventListener('pointermove', onPointerMove);
      removePointerMove = () => canvas.removeEventListener('pointermove', onPointerMove);

      stateRef.current = {
        renderer,
        material,
        geometry,
        placeholder,
        uniforms,
        loadedTextures,
        scene,
        camera,
        ro,
        raf: 0,
      };

      const loop = () => {
        const state = stateRef.current;
        if (!state) return;
        state.raf = requestAnimationFrame(loop);
        state.uniforms.uTime.value = performance.now() * 0.001;
        const cycle = 0.5 + 0.5 * Math.sin(state.uniforms.uTime.value * 0.45);
        state.uniforms.uMaskProgress.value = cycle;
        state.uniforms.uMaskProgress2.value = 1 - cycle;
        state.uniforms.uSceneProgress.value = 0.15 + cycle * 0.85;
        state.renderer.render(state.scene, state.camera);

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
        state.loadedTextures.forEach((texture) => texture.dispose());
        state.placeholder.dispose();
        state.material.dispose();
        state.geometry.dispose();
        state.renderer.dispose();
      }
      removePointerMove?.();
      stateRef.current = null;
    };
  }, [textureKey]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.material.fragmentShader = shaderCode;
    state.material.needsUpdate = true;
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

export default memo(CaseTexturePreview);
