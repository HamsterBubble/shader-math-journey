import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import InstructionPanel from './InstructionPanel.jsx';
import CaseShaderPreview from './CaseShaderPreview.jsx';
import CaseWaterPreview from './CaseWaterPreview.jsx';
import CaseTexturePreview from './CaseTexturePreview.jsx';
import CaseModelParticlesPreview from './CaseModelParticlesPreview.jsx';
import CaseEditor from './CaseEditor.jsx';

function CaseWorkspace({ step, resetKey, compileStatus, onCompile, editorRef, onOpenKnowledge }) {
  const [practiceCode, setPracticeCode] = useState(step.practiceShader);
  const practiceRendererRef = useRef(null);

  useEffect(() => {
    setPracticeCode(step.practiceShader);
  }, [step.id, step.practiceShader]);

  useEffect(() => {
    setPracticeCode(step.practiceShader);
    if (editorRef.current) {
      editorRef.current.setValue(step.practiceShader);
    }
    if (practiceRendererRef.current) {
      practiceRendererRef.current.setShader(step.practiceShader);
    }
    onCompile({ ok: true, error: null });
  }, [resetKey]);

  const handleCompile = useCallback((code) => {
    setPracticeCode(code);
    if (step.runtime === 'three') {
      onCompile({ ok: true, error: null });
      return;
    }
    if (practiceRendererRef.current) {
      const result = practiceRendererRef.current.setShader(code);
      onCompile(result.ok ? { ok: true, error: null } : { ok: false, error: result.error });
    }
  }, [onCompile, step.previewKind, step.runtime]);

  const handlePracticeReady = useCallback((renderer) => {
    practiceRendererRef.current = renderer;
    if (renderer) {
      const result = renderer.setShader(practiceCode);
      onCompile(result.ok ? { ok: true, error: null } : { ok: false, error: result.error });
    }
  }, [practiceCode, onCompile]);

  const instructionLesson = {
    id: step.id,
    instructions: step.instructions,
    goalCode: null,
  };

  const isThreeRuntime = step.runtime === 'three';
  const PreviewComponent =
    step.previewKind === 'water-sim' ? CaseWaterPreview
      : step.previewKind === 'texture-fragment' ? CaseTexturePreview
        : step.previewKind === 'model-particles' ? CaseModelParticlesPreview
          : CaseShaderPreview;

  return (
    <div className="workspace">
      <InstructionPanel lesson={instructionLesson} onOpenKnowledge={onOpenKnowledge} />
      <div className="editor-preview case-workspace">
        <div className="case-dual-preview">
          <PreviewComponent
            shaderCode={step.goalShader}
            label="目标"
            step={step}
          />
          <PreviewComponent
            key={`practice-${step.id}`}
            shaderCode={practiceCode}
            label="你的实现"
            compileStatus={compileStatus}
            onReady={isThreeRuntime ? undefined : handlePracticeReady}
            step={step}
          />
        </div>
        <div className="editor-area">
          <div className="editor-tabs">
            <div className="editor-tab active">sim.glsl</div>
          </div>
          <CaseEditor
            stepId={step.id}
            code={step.practiceShader}
            compileStatus={compileStatus}
            editorRef={editorRef}
            onCompile={handleCompile}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CaseWorkspace);
