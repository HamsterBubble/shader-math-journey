import React, { memo, useRef, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { glslDocs } from '../core/glsl-docs.js';
import { getGlslLanguageConfiguration } from '../core/glsl-language-config.js';
import { registerGlslFormatting, addGlslFormatShortcut } from '../core/glsl-format.js';

// ── Monaco worker configuration for Vite ──
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

// ── Register GLSL language (once) ──
let langRegistered = false;
const SHORTCUT_STATE_KEY = '__shaderMathCodeEditorShortcuts';

function getShortcutState() {
  if (typeof window === 'undefined') return null;
  if (window[SHORTCUT_STATE_KEY]) return window[SHORTCUT_STATE_KEY];

  const state = {
    active: null,
    onKeyDown(event) {
      const active = state.active;
      if (!active) return;
      const targetClass = String(event.target?.className || '');
      if (!active.editor.hasTextFocus() && !targetClass.includes('native-edit-context')) return;

      const isCommand = event.ctrlKey || event.metaKey;
      if (isCommand && !event.shiftKey && !event.altKey && event.code === 'Slash') {
        event.preventDefault();
        event.stopPropagation();
        active.toggleLineComment();
        return;
      }
      if (event.shiftKey && event.altKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyA') {
        event.preventDefault();
        event.stopPropagation();
        active.toggleBlockComment();
      }
    },
    dispose() {
      document.removeEventListener('keydown', state.onKeyDown, true);
      state.active = null;
    },
  };

  document.addEventListener('keydown', state.onKeyDown, true);
  window[SHORTCUT_STATE_KEY] = state;
  return state;
}

// ── Build snippet params (e.g. "float edge0, float x" → ["edge0", "x"]) ──
function parseParamNames(paramsStr) {
  if (!paramsStr.trim()) return [];
  return paramsStr.split(',').map((part) => {
    const tokens = part.trim().replace(/\[\d*\]/g, '').split(/\s+/);
    return tokens[tokens.length - 1] || 'x';
  });
}

const VARIABLE_KEYS = new Set([
  'gl_FragCoord', 'gl_FragColor', 'gl_Position', 'gl_PointSize',
  'u_time', 'u_resolution', 'u_mouse',
]);
const TYPE_KEYS = new Set([
  'float', 'int', 'bool', 'vec2', 'vec3', 'vec4',
  'ivec2', 'ivec3', 'ivec4', 'bvec2', 'bvec3', 'bvec4',
  'mat2', 'mat3', 'mat4', 'sampler2D', 'samplerCube',
]);
const QUALIFIER_KEYS = new Set([
  'uniform', 'varying', 'attribute', 'precision', 'const',
  'highp', 'mediump', 'lowp',
]);

const GLSL_TYPE_RE = '(?:float|int|bool|vec[234]|ivec[234]|bvec[234]|mat[234]|sampler2D|samplerCube)';
const GLSL_QUALIFIER_RE = '(?:uniform|varying|attribute|in|out|inout|const|highp|mediump|lowp)';

function stripGlslComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ');
}

function parseDeclNames(rest) {
  return rest.split(',').map((part) => {
    const nameMatch = part.trim().match(/^([a-zA-Z_]\w*)/);
    return nameMatch ? nameMatch[1] : null;
  }).filter(Boolean);
}

/** Scan shader source for user-defined variables and functions. */
function extractUserSymbols(source) {
  const text = stripGlslComments(source);
  const symbols = new Map();

  const addVar = (name, type) => {
    if (!name || symbols.get(name)?.kind === 'function') return;
    symbols.set(name, { kind: 'variable', detail: type });
  };

  const addFunc = (name, returnType) => {
    symbols.set(name, { kind: 'function', detail: `${returnType} ${name}()` });
  };

  const funcRe = new RegExp(`\\b(${GLSL_TYPE_RE})\\s+([a-zA-Z_]\\w*)\\s*\\(`, 'g');
  let match;
  while ((match = funcRe.exec(text)) !== null) {
    const [, returnType, name] = match;
    if (name !== 'main') addFunc(name, returnType);
  }

  const forRe = new RegExp(`\\bfor\\s*\\(\\s*(${GLSL_TYPE_RE})\\s+([a-zA-Z_]\\w*)\\b`, 'g');
  while ((match = forRe.exec(text)) !== null) {
    addVar(match[2], match[1]);
  }

  const varLineRe = new RegExp(
    `^(?:\\s*(?:${GLSL_QUALIFIER_RE})\\s+)*(?:precision\\s+\\w+\\s+)?(?:${GLSL_QUALIFIER_RE}\\s+)*(${GLSL_TYPE_RE})\\s+(.+)$`,
  );

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const declMatch = trimmed.match(varLineRe);
    if (!declMatch) continue;

    const [, type, rest] = declMatch;
    for (const name of parseDeclNames(rest.split(';')[0])) {
      addVar(name, type);
    }
  }

  return symbols;
}

function buildUserSuggestions(symbols, range) {
  const suggestions = [];

  for (const [name, info] of symbols) {
    if (info.kind === 'function') {
      suggestions.push({
        label: name,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: `${name}($0)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: info.detail,
        sortText: `0_${name}`,
        range,
      });
      continue;
    }

    suggestions.push({
      label: name,
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: name,
      detail: info.detail,
      sortText: `0_${name}`,
      range,
    });
  }

  return suggestions;
}

function docKind(key) {
  if (VARIABLE_KEYS.has(key)) return monaco.languages.CompletionItemKind.Variable;
  if (TYPE_KEYS.has(key)) return monaco.languages.CompletionItemKind.Class;
  if (QUALIFIER_KEYS.has(key)) return monaco.languages.CompletionItemKind.Keyword;
  return monaco.languages.CompletionItemKind.Function;
}

// ── Build one completion item per glslDocs entry, cached across calls ──
let cachedDocSuggestions = null;
function buildDocSuggestions(range) {
  if (!cachedDocSuggestions) {
    cachedDocSuggestions = Object.entries(glslDocs).map(([key, doc]) => {
      const firstLine = doc.signature.split('\n')[0];
      const call = firstLine.match(new RegExp(`\\b${key}\\s*\\(([^)]*)\\)`));
      const kind = docKind(key);
      const documentation = {
        value: '```glsl\n' + doc.signature + '\n```\n\n' + doc.description,
      };

      if (call && kind === monaco.languages.CompletionItemKind.Function) {
        const params = parseParamNames(call[1]);
        const insertText = params.length
          ? `${key}(${params.map((p, i) => `\${${i + 1}:${p}}`).join(', ')})`
          : `${key}()`;
        return {
          label: key,
          kind,
          insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation,
          detail: firstLine,
        };
      }

      return {
        label: key,
        kind,
        insertText: key,
        documentation,
        detail: firstLine,
      };
    });
  }
  return cachedDocSuggestions.map((s) => ({ ...s, range }));
}

// ── Control-flow / structural snippets not covered by glslDocs ──
const EXTRA_SNIPPET_SUGGESTIONS = [
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'if (${1:condition}) {\n\t$0\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'if (condition) { }',
  },
  {
    label: 'else',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'else {\n\t$0\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'else { }',
  },
  {
    label: 'for',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t$0\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'for (int i = 0; i < n; i++) { }',
  },
  {
    label: 'while',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'while (${1:condition}) {\n\t$0\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'while (condition) { }',
  },
  {
    label: 'main',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'void main() {\n\t$0\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'void main() { }',
  },
  {
    label: 'return',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'return',
  },
  {
    label: 'discard',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'discard;',
  },
  {
    label: 'break',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'break;',
  },
  {
    label: 'continue',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'continue;',
  },
  {
    label: 'struct',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'struct ${1:Name} {\n\t$0\n};',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'struct Name { };',
  },
  { label: 'void', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'void' },
  { label: 'in', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'in' },
  { label: 'out', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'out' },
  { label: 'inout', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'inout' },
  { label: 'true', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'true' },
  { label: 'false', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'false' },
];

function getSuggestionLabel(suggestion) {
  if (typeof suggestion.label === 'string') return suggestion.label;
  return suggestion.label?.label ?? '';
}

/** Keep only prefix matches that still add characters; hide the widget when none remain. */
function filterCompletionSuggestions(suggestions, typedWord) {
  if (!typedWord) return suggestions;

  return suggestions.filter((s) => {
    const label = getSuggestionLabel(s);
    return label.startsWith(typedWord) && label.length > typedWord.length;
  });
}

function registerGLSL() {
  if (langRegistered) return;
  langRegistered = true;

  monaco.languages.register({ id: 'glsl' });

  monaco.languages.setLanguageConfiguration('glsl', getGlslLanguageConfiguration(monaco));
  registerGlslFormatting(monaco);

  // ── Autocomplete for GLSL built-ins + symbols declared in the editor ──
  monaco.languages.registerCompletionItemProvider('glsl', {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = new monaco.Range(
        position.lineNumber, word.startColumn,
        position.lineNumber, word.endColumn,
      );

      const userSymbols = extractUserSymbols(model.getValue());
      const userNames = new Set(userSymbols.keys());

      const suggestions = filterCompletionSuggestions([
        ...buildUserSuggestions(userSymbols, range),
        ...buildDocSuggestions(range).filter((s) => !userNames.has(s.label)),
        ...EXTRA_SNIPPET_SUGGESTIONS.map((s) => ({ ...s, range })),
      ], word.word);

      return { suggestions };
    },
  });

  // ── Hover documentation for GLSL built-ins ──
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

function addCommentShortcuts(editor) {
  const shortcutState = getShortcutState();
  const toggleLineCommentManually = () => {
    const model = editor.getModel();
    const selection = editor.getSelection();
    if (!model || !selection) return;

    const startLine = selection.startLineNumber;
    const endLine = selection.endColumn === 1 && selection.endLineNumber > startLine
      ? selection.endLineNumber - 1
      : selection.endLineNumber;
    const lineNumbers = [];
    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
      if (model.getLineContent(lineNumber).trim()) {
        lineNumbers.push(lineNumber);
      }
    }
    if (lineNumbers.length === 0) lineNumbers.push(startLine);

    const shouldUncomment = lineNumbers.every((lineNumber) => (
      /^\s*\/\//.test(model.getLineContent(lineNumber))
    ));

    const edits = lineNumbers.map((lineNumber) => {
      const line = model.getLineContent(lineNumber);
      const indentLength = line.match(/^\s*/)?.[0].length ?? 0;
      if (!shouldUncomment) {
        const column = indentLength + 1;
        return {
          range: new monaco.Range(lineNumber, column, lineNumber, column),
          text: '// ',
        };
      }

      const commentIndex = line.indexOf('//', indentLength);
      const hasSpaceAfterComment = line[commentIndex + 2] === ' ';
      const startColumn = commentIndex + 1;
      const endColumn = startColumn + (hasSpaceAfterComment ? 3 : 2);
      return {
        range: new monaco.Range(lineNumber, startColumn, lineNumber, endColumn),
        text: '',
      };
    });

    editor.pushUndoStop();
    editor.executeEdits('toggle-line-comment', edits);
    editor.pushUndoStop();
  };

  const toggleLineComment = () => {
    toggleLineCommentManually();
  };
  const toggleBlockComment = () => {
    editor.trigger('keyboard', 'editor.action.blockComment', {});
  };

  const activateShortcuts = () => {
    if (!shortcutState) return;
    shortcutState.active = { editor, toggleLineComment, toggleBlockComment };
  };

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, toggleLineComment);
  editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyA, toggleBlockComment);
  const focusTextDisposable = editor.onDidFocusEditorText(activateShortcuts);
  const focusWidgetDisposable = editor.onDidFocusEditorWidget(activateShortcuts);
  editor.onDidDispose(() => {
    focusTextDisposable.dispose();
    focusWidgetDisposable.dispose();
    if (shortcutState?.active?.editor === editor) {
      shortcutState.active = null;
    }
  });

  return activateShortcuts;
}

function CodeEditor({ lesson, code, codeKey, readOnly = false, editorRef, compileStatus, onCompile }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const timerRef = useRef(null);
  const onCompileRef = useRef(onCompile);
  const isApplyingSourceRef = useRef(false);
  const sourceCode = code ?? lesson?.code ?? '';
  const sourceKey = codeKey ?? lesson?.id;
  const sourceKeyRef = useRef(sourceKey);

  useEffect(() => {
    onCompileRef.current = onCompile;
  }, [onCompile]);

  // Create editor once
  useEffect(() => {
    registerGLSL();

    const editor = monaco.editor.create(containerRef.current, {
      value: sourceCode,
      language: 'glsl',
      theme: 'shader-dark',
      readOnly,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontLigatures: true,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      autoIndent: 'full',
      renderWhitespace: 'none',
      padding: { top: 12, bottom: 12 },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      bracketPairColorization: { enabled: false },
      guides: {
        indentation: true,
        highlightActiveIndentation: false,
        bracketPairs: false,
        bracketPairsHorizontal: false,
        highlightActiveBracketPair: false,
      },
      suggest: { showKeywords: true },
      fixedOverflowWidgets: true,
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
      if (isApplyingSourceRef.current) return;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onCompileRef.current?.(editor.getValue());
      }, 250);
    });

    // Ctrl+S shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onCompileRef.current?.(editor.getValue());
    });

    const activateEditorShortcuts = addCommentShortcuts(editor);
    addGlslFormatShortcut(editor, monaco);

    const container = containerRef.current;
    const focusEditor = () => {
      editor.focus();
      activateEditorShortcuts();
    };
    container?.addEventListener('pointerdown', focusEditor);

    instanceRef.current = editor;
    editorRef.current = editor;
    window.__debugEditor = editor;
    window.__debugMonaco = monaco;

    return () => {
      clearTimeout(timerRef.current);
      container?.removeEventListener('pointerdown', focusEditor);
      editor.dispose();
      instanceRef.current = null;
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  // Update code when source changes
  useEffect(() => {
    if (!instanceRef.current) return;
    if (sourceKeyRef.current !== sourceKey || instanceRef.current.getValue() !== sourceCode) {
      sourceKeyRef.current = sourceKey;
      isApplyingSourceRef.current = true;
      try {
        instanceRef.current.setValue(sourceCode);
      } finally {
        isApplyingSourceRef.current = false;
      }
    }
  }, [sourceKey, sourceCode]);

  // Update error markers when compile status changes
  useEffect(() => {
    if (instanceRef.current) {
      setEditorErrors(instanceRef.current, compileStatus.ok ? null : compileStatus.error);
    }
  }, [compileStatus]);

  return <div className="editor-container" ref={containerRef} />;
}

export default memo(CodeEditor);
