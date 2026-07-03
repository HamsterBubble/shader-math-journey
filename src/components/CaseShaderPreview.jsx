import React, { memo, useRef, useEffect, useState } from 'react';
import { ShaderRenderer } from '../core/shader-renderer.js';

function CaseShaderPreview({ shaderCode, label, compileStatus, onReady }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastT: performance.now() });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new ShaderRenderer(canvas);
    renderer.setShader(shaderCode);
    renderer.start();
    rendererRef.current = renderer;
    onReady?.(renderer);

    let animId;
    const fpsLoop = () => {
      animId = requestAnimationFrame(fpsLoop);
      fpsRef.current.frames++;
      const now = performance.now();
      if (now - fpsRef.current.lastT >= 1000) {
        setFps(fpsRef.current.frames);
        fpsRef.current.frames = 0;
        fpsRef.current.lastT = now;
      }
    };
    fpsLoop();

    return () => {
      cancelAnimationFrame(animId);
      renderer.destroy();
      rendererRef.current = null;
      onReady?.(null);
    };
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setShader(shaderCode);
    }
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

export default memo(CaseShaderPreview);
