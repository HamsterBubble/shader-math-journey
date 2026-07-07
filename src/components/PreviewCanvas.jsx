import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { ShaderRenderer } from '../core/shader-renderer.js';

function PreviewCanvas({
  lesson,
  shaderCode,
  shaderKey,
  compileStatus,
  rendererRef,
  onCompile,
  autoCompileOnSourceChange = true,
}) {
  const canvasRef = useRef(null);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastT: performance.now() });

  // Init renderer once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new ShaderRenderer(canvas);
    if (shaderCode) {
      renderer.setShader(shaderCode);
    }
    renderer.start();
    rendererRef.current = renderer;

    // FPS counter
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
    };
  }, []);

  const initialCode = shaderCode ?? lesson?.code;

  // Compile when source changes (lesson workspace)
  useEffect(() => {
    if (!autoCompileOnSourceChange || !onCompile) return;
    if (rendererRef.current && initialCode) {
      onCompile(initialCode);
    }
  }, [lesson?.id, shaderKey, initialCode, onCompile, rendererRef, autoCompileOnSourceChange]);

  return (
    <div className="preview" id="preview-area">
      <canvas ref={canvasRef} />
      <div className={`status ${compileStatus.ok ? 'ok' : 'err'}`}>
        <span className="dot" />
        <span>{compileStatus.ok ? '运行中' : '编译错误'}</span>
      </div>
      <div className="fps">{fps} fps</div>
      {!compileStatus.ok && compileStatus.error && (
        <div className="error-bar show">{compileStatus.error}</div>
      )}
    </div>
  );
}

export default memo(PreviewCanvas);
