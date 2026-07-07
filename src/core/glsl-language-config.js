/** GLSL indentation / Enter-key behavior (C-like, aligned with VS Code defaults). */
export function getGlslLanguageConfiguration(monaco) {
  const { IndentAction } = monaco.languages;

  return {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
    ],
    indentationRules: {
      increaseIndentPattern: /^.*(\{[^}]*|\([^)]*|\[[^\]]*)$/,
      decreaseIndentPattern: /^\s*[\}\]\)].*$/,
    },
    onEnterRules: [
      {
        beforeText: /^\s*((else\s+)?if|for|while)\s*\([^)]*\)\s*$/,
        action: { indentAction: IndentAction.Indent },
      },
      {
        previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
        beforeText: /^\s+([^{i\s]|i(?!f\b))/,
        action: { indentAction: IndentAction.Outdent },
      },
      {
        beforeText: /^.*\{[^}]*$/,
        afterText: /^\s*\}.*$/,
        action: { indentAction: IndentAction.IndentOutdent },
      },
      {
        beforeText: /^.*\([^)]*$/,
        afterText: /^\s*\).*$/,
        action: { indentAction: IndentAction.IndentOutdent },
      },
      {
        beforeText: /^\s*\/\/.*/,
        afterText: /^(?!\s*$)/,
        action: { indentAction: IndentAction.None, appendText: '// ' },
      },
    ],
  };
}
