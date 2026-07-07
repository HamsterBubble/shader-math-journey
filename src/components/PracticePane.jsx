import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import PreviewCanvas from './PreviewCanvas.jsx';
import CodeEditor from './CodeEditor.jsx';

function PracticePane({ label, code, codeKey, readOnly = false, onCodeChange }) {
  const rendererRef = useRef(null);
  const editorRef = useRef(null);
  const [compileStatus, setCompileStatus] = useState({ ok: true, error: null });

  const applyShader = useCallback((nextCode) => {
    if (!rendererRef.current) return { ok: true, error: null };
    const result = rendererRef.current.setShader(nextCode);
    setCompileStatus(result.ok ? { ok: true, error: null } : { ok: false, error: result.error });
    return result;
  }, []);

  const handleEditorCompile = useCallback((nextCode) => {
    applyShader(nextCode);
    onCodeChange?.(nextCode);
  }, [applyShader, onCodeChange]);

  useEffect(() => {
    applyShader(code);
  }, [codeKey, code, applyShader]);

  return (
    <div className="practice-pane">
      {label ? <div className="practice-pane-label">{label}</div> : null}
      <div className="practice-pane-workspace">
        <PreviewCanvas
          shaderCode={code}
          shaderKey={codeKey}
          compileStatus={compileStatus}
          rendererRef={rendererRef}
          autoCompileOnSourceChange={false}
        />
        <div className="editor-area">
          <div className="editor-tabs">
            <div className="editor-tab">fragment.glsl</div>
          </div>
          <CodeEditor
            code={code}
            codeKey={codeKey}
            readOnly={readOnly}
            editorRef={editorRef}
            compileStatus={compileStatus}
            onCompile={handleEditorCompile}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(PracticePane);
