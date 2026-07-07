const INDENT = '  ';

const TWO_CHAR_OPS = new Set([
  '==', '!=', '<=', '>=', '&&', '||',
  '+=', '-=', '*=', '/=', '%=',
  '++', '--',
]);

function stripForBraceScan(line) {
  let out = '';
  let i = 0;
  while (i < line.length) {
    if (line[i] === '/' && line[i + 1] === '/') break;
    if (line[i] === '/' && line[i + 1] === '*') {
      i += 2;
      while (i < line.length - 1 && !(line[i] === '*' && line[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      i += 1;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === '\\') i += 1;
        i += 1;
      }
      i += 1;
      continue;
    }
    out += line[i];
    i += 1;
  }
  return out;
}

function readNumber(code, start) {
  let i = start;
  if (code[i] === '.') i += 1;
  while (i < code.length && /[\d.]/.test(code[i])) i += 1;
  if (i < code.length && (code[i] === 'e' || code[i] === 'E')) {
    i += 1;
    if (i < code.length && (code[i] === '+' || code[i] === '-')) i += 1;
    while (i < code.length && /\d/.test(code[i])) i += 1;
  }
  return { text: code.slice(start, i), end: i };
}

function tokenizeGlslCode(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    const two = code.slice(i, i + 2);
    if (TWO_CHAR_OPS.has(two)) {
      tokens.push({ kind: 'op', text: two });
      i += 2;
      continue;
    }

    if ('(){}[],;'.includes(ch)) {
      tokens.push({ kind: 'punct', text: ch });
      i += 1;
      continue;
    }

    if (ch === '.' && i + 1 < code.length && /\d/.test(code[i + 1])) {
      const num = readNumber(code, i);
      tokens.push({ kind: 'num', text: num.text });
      i = num.end;
      continue;
    }

    if (ch === '.' && (i === 0 || !/\w/.test(code[i - 1]))) {
      tokens.push({ kind: 'punct', text: '.' });
      i += 1;
      continue;
    }

    if ('=<>!+-*/%&|^?:'.includes(ch)) {
      tokens.push({ kind: 'op', text: ch });
      i += 1;
      continue;
    }

    if (/\d/.test(ch)) {
      const num = readNumber(code, i);
      tokens.push({ kind: 'num', text: num.text });
      i = num.end;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let start = i;
      i += 1;
      while (i < code.length && /\w/.test(code[i])) i += 1;
      tokens.push({ kind: 'id', text: code.slice(start, i) });
      continue;
    }

    tokens.push({ kind: 'raw', text: ch });
    i += 1;
  }

  return tokens;
}

function isUnaryPlusMinus(op, prev) {
  if (op !== '+' && op !== '-') return false;
  if (!prev) return true;
  if (prev.kind === 'op') return true;
  if (prev.kind === 'punct') return '([,=?:;{'.includes(prev.text);
  return false;
}

function isBinaryOperator(token, prev) {
  if (token.kind !== 'op') return false;
  const op = token.text;
  if (['*', '/', '%', '==', '!=', '<=', '>=', '&&', '||', '=', '<', '>'].includes(op)) {
    return true;
  }
  if (op === '+' || op === '-') {
    return !isUnaryPlusMinus(op, prev);
  }
  return false;
}

const KEYWORD_BEFORE_PAREN = new Set(['if', 'for', 'while', 'switch', 'return']);
const COMPOUND_ASSIGN = new Set(['+=', '-=', '*=', '/=', '%=']);

function shouldSpaceBefore(curr, prev, prevPrev) {
  if (!prev) return false;

  if (curr.kind === 'punct') {
    if (')]}'.includes(curr.text)) return false;
    if (curr.text === '.') return false;
    if (curr.text === ';') return false;
    if (curr.text === ',') return false;
    if (curr.text === '{' && prev.kind === 'punct' && prev.text === ')') return true;
  }

  if (prev.kind === 'punct') {
    if ('([{'.includes(prev.text)) return false;
    if (prev.text === '.') return false;
    if (prev.text === ',') return true;
    if (prev.text === ';') return !')}]'.includes(curr.text);
  }

  if (prev.kind === 'id' && curr.kind === 'punct' && curr.text === '(') {
    return KEYWORD_BEFORE_PAREN.has(prev.text);
  }

  if (curr.kind === 'op') {
    if ((curr.text === '+' || curr.text === '-') && isUnaryPlusMinus(curr.text, prev)) {
      if (prev?.kind === 'op' && !isUnaryPlusMinus(prev.text, prevPrev) && !COMPOUND_ASSIGN.has(prev.text)) {
        return true;
      }
      return false;
    }
    return isBinaryOperator(curr, prev);
  }

  if (prev.kind === 'op') {
    if (COMPOUND_ASSIGN.has(prev.text)) return false;
    if (isUnaryPlusMinus(prev.text, prevPrev)) return false;
    return true;
  }

  if (prev.kind === 'id' && curr.kind === 'id') {
    return true;
  }

  if (prev.kind === 'punct' && prev.text === ')') {
    return curr.kind === 'op' && isBinaryOperator(curr, prev);
  }

  return false;
}

function renderTokens(tokens) {
  let result = '';

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : null;
    const prevPrev = i > 1 ? tokens[i - 2] : null;

    if (shouldSpaceBefore(token, prev, prevPrev) && result.length > 0) {
      result += ' ';
    }
    result += token.text;
  }

  return result;
}

function normalizeCodeSpacing(code) {
  return renderTokens(tokenizeGlslCode(code));
}

function formatLineSpacing(line) {
  const segments = [];
  let code = '';
  let i = 0;

  const pushCode = () => {
    if (!code) return;
    segments.push(normalizeCodeSpacing(code));
    code = '';
  };

  while (i < line.length) {
    if (line[i] === '/' && line[i + 1] === '/') {
      pushCode();
      segments.push(line.slice(i));
      break;
    }
    if (line[i] === '/' && line[i + 1] === '*') {
      pushCode();
      const start = i;
      i += 2;
      while (i < line.length - 1 && !(line[i] === '*' && line[i + 1] === '/')) i += 1;
      i += 2;
      segments.push(line.slice(start, i));
      continue;
    }
    if (line[i] === '"' || line[i] === "'") {
      pushCode();
      const quote = line[i];
      const start = i;
      i += 1;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === '\\') i += 1;
        i += 1;
      }
      i += 1;
      segments.push(line.slice(start, i));
      continue;
    }
    code += line[i];
    i += 1;
  }

  pushCode();
  return segments.join('');
}

/** Brace-aware indent formatter for GLSL (C-like). */
export function formatGlslSource(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let depth = 0;

  for (const line of lines) {
    const trimmed = formatLineSpacing(line.trim());
    if (!trimmed) {
      out.push('');
      continue;
    }

    const scan = stripForBraceScan(trimmed);
    let i = 0;
    while (i < scan.length && scan[i] === '}') {
      depth = Math.max(0, depth - 1);
      i += 1;
    }

    out.push(INDENT.repeat(depth) + trimmed);

    for (; i < scan.length; i += 1) {
      if (scan[i] === '{') depth += 1;
      if (scan[i] === '}') depth = Math.max(0, depth - 1);
    }
  }

  return out.join('\n').replace(/\s+$/, '');
}

export function registerGlslFormatting(monaco) {
  const formatRange = (model, range) => {
    const text = model.getValueInRange(range);
    return [{
      range,
      text: formatGlslSource(text),
    }];
  };

  monaco.languages.registerDocumentFormattingEditProvider('glsl', {
    provideDocumentFormattingEdits(model) {
      return formatRange(model, model.getFullModelRange());
    },
  });

  monaco.languages.registerDocumentRangeFormattingEditProvider('glsl', {
    provideDocumentRangeFormattingEdits(model, range) {
      return formatRange(model, range);
    },
  });
}

export function addGlslFormatShortcut(editor, monaco) {
  const format = () => {
    const action = editor.getSelection()?.isEmpty()
      ? 'editor.action.formatDocument'
      : 'editor.action.formatSelection';
    editor.trigger('keyboard', action, {});
  };

  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, format);
}
