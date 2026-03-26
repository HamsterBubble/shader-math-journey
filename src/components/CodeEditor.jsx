import React, { memo, useRef, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// ── Monaco worker configuration for Vite ──
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

// ── Register GLSL language (once) ──
let langRegistered = false;
function registerGLSL() {
  if (langRegistered) return;
  langRegistered = true;

  monaco.languages.register({ id: 'glsl' });

  monaco.languages.setMonarchTokensProvider('glsl', {
    keywords: [
      'void', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue',
      'discard', 'struct', 'in', 'out', 'inout', 'uniform', 'varying', 'attribute',
      'const', 'precision', 'highp', 'mediump', 'lowp', 'true', 'false',
    ],
    types: [
      'float', 'int', 'bool', 'vec2', 'vec3', 'vec4',
      'ivec2', 'ivec3', 'ivec4', 'bvec2', 'bvec3', 'bvec4',
      'mat2', 'mat3', 'mat4', 'sampler2D', 'samplerCube',
    ],
    builtins: [
      'gl_FragCoord', 'gl_FragColor', 'gl_Position', 'gl_PointSize',
      'radians', 'degrees', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt',
      'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max', 'clamp',
      'mix', 'step', 'smoothstep', 'length', 'distance', 'dot', 'cross',
      'normalize', 'reflect', 'refract', 'texture2D', 'textureCube',
    ],
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        [/#\w+/, 'keyword.directive'],
        [/\b(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?\b/, 'number.float'],
        [/\b\d+\b/, 'number'],
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@types': 'type',
            '@builtins': 'builtin',
            '@default': 'identifier',
          },
        }],
        [/[{}()\[\]]/, 'delimiter.bracket'],
        [/[<>]=?|[!=]=|&&|\|\||[+\-*\/%&|^~!]/, 'operator'],
        [/[;,.]/, 'delimiter'],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],
    },
  });

  monaco.editor.defineTheme('shader-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'f778ba', fontStyle: '' },
      { token: 'type', foreground: '39d2c0', fontStyle: 'bold' },
      { token: 'builtin', foreground: '58a6ff', fontStyle: '' },
      { token: 'number', foreground: 'd29922' },
      { token: 'number.float', foreground: 'd29922' },
      { token: 'comment', foreground: '484f58', fontStyle: 'italic' },
      { token: 'operator', foreground: '8b949e' },
      { token: 'delimiter', foreground: '8b949e' },
      { token: 'keyword.directive', foreground: 'bc8cff' },
      { token: 'identifier', foreground: 'e6edf3' },
    ],
    colors: {
      'editor.background': '#0a0e14',
      'editor.foreground': '#e6edf3',
      'editor.lineHighlightBackground': '#161b2266',
      'editorCursor.foreground': '#58a6ff',
      'editor.selectionBackground': '#58a6ff33',
      'editorLineNumber.foreground': '#333d4b',
      'editorLineNumber.activeForeground': '#58a6ff',
      'editorIndentGuide.background': '#1c233366',
      'editorBracketMatch.background': '#58a6ff22',
      'editorBracketMatch.border': '#58a6ff44',
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

  const markers = [];
  const lines = errorMsg.split('\n');
  for (const line of lines) {
    const m = line.match(/(\d+):(\d+):/);
    if (m) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: line.trim(),
        startLineNumber: parseInt(m[2]),
        startColumn: 1,
        endLineNumber: parseInt(m[2]),
        endColumn: 999,
      });
    }
  }

  if (markers.length === 0 && errorMsg.trim()) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: errorMsg.trim(),
      startLineNumber: 1, startColumn: 1,
      endLineNumber: 1, endColumn: 999,
    });
  }

  monaco.editor.setModelMarkers(model, 'glsl', markers);
}

function CodeEditor({ lesson, editorRef, compileStatus, onCompile }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const timerRef = useRef(null);
  const lessonIdRef = useRef(lesson.id);

  // Create editor once
  useEffect(() => {
    registerGLSL();

    const editor = monaco.editor.create(containerRef.current, {
      value: lesson.code,
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
      renderWhitespace: 'none',
      padding: { top: 12, bottom: 12 },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      bracketPairColorization: { enabled: true },
      guides: { indentation: true, bracketPairs: true },
      suggest: { showKeywords: true },
      wordWrap: 'off',
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
      },
    });

    // Live compile on change (debounced)
    editor.onDidChangeModelContent(() => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onCompile(editor.getValue());
      }, 250);
    });

    // Ctrl+S shortcut
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

  // Update code when lesson changes
  useEffect(() => {
    if (instanceRef.current && lessonIdRef.current !== lesson.id) {
      lessonIdRef.current = lesson.id;
      instanceRef.current.setValue(lesson.code);
    }
  }, [lesson.id, lesson.code]);

  // Update error markers when compile status changes
  useEffect(() => {
    if (instanceRef.current) {
      setEditorErrors(instanceRef.current, compileStatus.ok ? null : compileStatus.error);
    }
  }, [compileStatus]);

  return <div className="editor-container" ref={containerRef} />;
}

export default memo(CodeEditor);
