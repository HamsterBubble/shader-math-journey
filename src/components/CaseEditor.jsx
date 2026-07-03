import React, { memo, useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { glslDocs } from '../core/glsl-docs.js';

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

let langRegistered = false;
function registerGLSL() {
  if (langRegistered) return;
  langRegistered = true;

  monaco.languages.register({ id: 'glsl' });
  monaco.languages.registerHoverProvider('glsl', {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      const doc = glslDocs[word.word];
      if (!doc) return null;
      return {
        range: new monaco.Range(
          position.lineNumber, word.startColumn,
          position.lineNumber, word.endColumn,
        ),
        contents: [
          { value: '```glsl\n' + doc.signature + '\n```' },
          { value: doc.description },
        ],
      };
    },
  });
}

function setEditorErrors(editor, errorMsg) {
  const model = editor.getModel();
  if (!model) return;
  if (!errorMsg) {
    monaco.editor.setModelMarkers(model, 'glsl', []);
    return;
  }
  monaco.editor.setModelMarkers(model, 'glsl', [{
    severity: monaco.MarkerSeverity.Error,
    message: errorMsg.trim(),
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 1,
    endColumn: 999,
  }]);
}

function CaseEditor({ stepId, code, compileStatus, editorRef, onCompile }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const timerRef = useRef(null);
  const stepIdRef = useRef(stepId);

  useEffect(() => {
    registerGLSL();
    const editor = monaco.editor.create(containerRef.current, {
      value: code,
      language: 'glsl',
      theme: 'shader-dark',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontLigatures: true,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      padding: { top: 12, bottom: 12 },
      wordWrap: 'off',
    });

    editor.onDidChangeModelContent(() => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onCompile(editor.getValue()), 250);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onCompile(editor.getValue());
    });

    instanceRef.current = editor;
    editorRef.current = editor;

    return () => {
      clearTimeout(timerRef.current);
      editor.dispose();
      instanceRef.current = null;
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current && stepIdRef.current !== stepId) {
      stepIdRef.current = stepId;
      instanceRef.current.setValue(code);
    }
  }, [stepId, code]);

  useEffect(() => {
    if (instanceRef.current) {
      setEditorErrors(instanceRef.current, compileStatus.ok ? null : compileStatus.error);
    }
  }, [compileStatus]);

  return <div className="editor-container" ref={containerRef} />;
}

export default memo(CaseEditor);
