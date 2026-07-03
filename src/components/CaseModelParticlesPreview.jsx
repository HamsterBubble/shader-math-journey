import React, { memo, useEffect, useRef, useState } from 'react';

const PARTICLE_VERTEX = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uBaseSize;

attribute vec2 aUv;
attribute float aLife;

varying vec2 vUv;
varying float vNormalised;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 p = position;
  float r = hash12(aUv * 30.0);
  float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + r * 6.2831);
  vec3 outward = normalize(p + vec3(0.001));
  p += outward * pulse * r * 0.07;
  p.xy += (uMouse - vec2(0.5)) * 0.18 * smoothstep(0.55, 1.0, r);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float size = (r * 14.0 + 2.0) * smoothstep(0.02, 1.0, aLife);
  gl_PointSize = size * uBaseSize * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vUv = aUv;
  vNormalised = smoothstep(0.62, 1.0, r) * (0.45 + 0.55 * pulse);
}
`;

function collectPositions(THREE, scene, maxPoints) {
  const meshes = [];
  const box = new THREE.Box3();

  scene.updateMatrixWorld(true);
  scene.traverse((node) => {
    if (!node.isMesh || !node.geometry?.attributes?.position) return;
    meshes.push(node);
  });

  const mainMesh = meshes
    .filter((node) => node.geometry.attributes.position.count > 1000)
    .sort((a, b) => b.geometry.attributes.position.count - a.geometry.attributes.position.count)[0];

  if (!mainMesh) return null;

  const all = [];
  [mainMesh].forEach((node) => {
    const attr = node.geometry.attributes.position;
    const local = new THREE.Vector3();
    for (let i = 0; i < attr.count; i++) {
      local.fromBufferAttribute(attr, i).applyMatrix4(node.matrixWorld);
      all.push(local.x, local.y, local.z);
      box.expandByPoint(local);
    }
  });

  if (!all.length) return null;

  const count = Math.min(maxPoints, Math.floor(all.length / 3));
  const stride = Math.max(1, Math.floor(all.length / 3 / count));
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const scale = 2.3 / Math.max(size.x, size.y, size.z, 0.001);
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const lives = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const source = (i * stride) * 3;
    positions[i * 3] = (all[source] - center.x) * scale;
    positions[i * 3 + 1] = (all[source + 1] - center.y) * scale - 0.08;
    positions[i * 3 + 2] = (all[source + 2] - center.z) * scale;
    const n = Math.ceil(Math.sqrt(count));
    const col = i % n;
    const row = Math.floor(i / n);
    uvs[i * 2] = col / n + 0.5 / n;
    uvs[i * 2 + 1] = row / n + 0.5 / n;
    lives[i] = 0.35 + ((i * 16807) % 997) / 997 * 0.65;
  }

  return { positions, uvs, lives, count };
}

function CaseModelParticlesPreview({ shaderCode, label, compileStatus, step }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastT: performance.now() });
  const modelUrl = step?.previewAssets?.model || '/gl/models/dragon-fly-flames-bb.glb';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let disposed = false;
    let removePointerMove = null;

    Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
    ]).then(([THREE, { GLTFLoader }, { DRACOLoader }]) => {
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setClearColor(0x030509, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
      camera.position.set(0, 0.12, 4.1);
      const group = new THREE.Group();
      scene.add(group);

      const mouse = new THREE.Vector2(0.5, 0.5);
      const material = new THREE.ShaderMaterial({
        name: 'case-model-particles',
        vertexShader: PARTICLE_VERTEX,
        fragmentShader: shaderCode,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: mouse },
          uBaseSize: { value: 1.35 },
          uAlpha: { value: 1 },
          uRenderType: { value: 0 },
          uMainColor: { value: new THREE.Color('#20BECA') },
          uWaterColor: { value: new THREE.Color('#FFAD0D') },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const loader = new GLTFLoader();
      const draco = new DRACOLoader();
      draco.setDecoderPath('/three/draco/');
      loader.setDRACOLoader(draco);

      loader.load(modelUrl, (gltf) => {
        if (disposed) return;
        const sampled = collectPositions(THREE, gltf.scene, 18000);
        if (!sampled) return;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(sampled.positions, 3));
        geometry.setAttribute('aUv', new THREE.BufferAttribute(sampled.uvs, 2));
        geometry.setAttribute('aLife', new THREE.BufferAttribute(sampled.lives, 1));
        const points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        group.add(points);
        stateRef.current.geometry = geometry;
        stateRef.current.points = points;
      });

      const ro = new ResizeObserver(() => {
        const rect = canvas.parentElement?.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect?.width || 320));
        const h = Math.max(1, Math.floor(rect?.height || 180));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
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
        scene,
        camera,
        group,
        draco,
        ro,
        raf: 0,
        geometry: null,
        points: null,
      };

      const loop = () => {
        const state = stateRef.current;
        if (!state) return;
        state.raf = requestAnimationFrame(loop);
        const time = performance.now() * 0.001;
        state.material.uniforms.uTime.value = time;
        state.group.rotation.y = time * 0.16;
        state.group.rotation.x = -1.05 + Math.sin(time * 0.45) * 0.04;
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
        state.geometry?.dispose();
        state.material.dispose();
        state.draco.dispose();
        state.renderer.dispose();
      }
      removePointerMove?.();
      stateRef.current = null;
    };
  }, [modelUrl]);

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

export default memo(CaseModelParticlesPreview);
