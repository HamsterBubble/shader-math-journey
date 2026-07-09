/**
 * Safe math expression parser for y = f(x).
 * Supports: + - * / ^, parentheses, unary minus,
 * sin cos tan asin acos atan sinh cosh tanh,
 * exp ln log log10 sqrt abs floor ceil round min max,
 * constants pi e, variable x.
 */

const CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
};

const FUNCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log,
  log10: Math.log10,
  sqrt: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  min: Math.min,
  max: Math.max,
};

function tokenize(input) {
  const src = input.replace(/\s+/g, '').toLowerCase();
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[0-9.]/.test(src[j])) j += 1;
      const num = Number(src.slice(i, j));
      if (!Number.isFinite(num)) throw new Error(`无效数字`);
      tokens.push({ type: 'number', value: num });
      i = j;
      continue;
    }
    if (/[a-z_]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[a-z_0-9]/.test(src[j])) j += 1;
      tokens.push({ type: 'ident', value: src.slice(i, j) });
      i = j;
      continue;
    }
    if ('+-*/^(),'.includes(ch)) {
      tokens.push({ type: ch });
      i += 1;
      continue;
    }
    throw new Error(`无法识别的字符「${ch}」`);
  }
  return tokens;
}

function parseExpression(tokens) {
  let pos = 0;

  function peek() {
    return tokens[pos] ?? null;
  }

  function consume(type) {
    const t = peek();
    if (!t || (type && t.type !== type)) {
      throw new Error('表达式语法错误');
    }
    pos += 1;
    return t;
  }

  function parsePrimary() {
    const t = peek();
    if (!t) throw new Error('表达式不完整');

    if (t.type === 'number') {
      consume();
      return () => t.value;
    }

    if (t.type === 'ident') {
      consume();
      if (t.value === 'x') return (x) => x;
      if (Object.prototype.hasOwnProperty.call(CONSTANTS, t.value)) {
        const v = CONSTANTS[t.value];
        return () => v;
      }
      if (Object.prototype.hasOwnProperty.call(FUNCTIONS, t.value)) {
        const fn = FUNCTIONS[t.value];
        consume('(');
        const args = [parseAdd()];
        while (peek()?.type === ',') {
          consume(',');
          args.push(parseAdd());
        }
        consume(')');
        return (x) => {
          const vals = args.map((a) => a(x));
          if (vals.some((v) => !Number.isFinite(v))) return NaN;
          return fn(...vals);
        };
      }
      throw new Error(`未知标识符「${t.value}」`);
    }

    if (t.type === '(') {
      consume('(');
      const inner = parseAdd();
      consume(')');
      return inner;
    }

    throw new Error('表达式语法错误');
  }

  function parseUnary() {
    if (peek()?.type === '-') {
      consume('-');
      const inner = parseUnary();
      return (x) => -inner(x);
    }
    if (peek()?.type === '+') {
      consume('+');
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePow() {
    let left = parseUnary();
    while (peek()?.type === '^') {
      consume('^');
      const right = parseUnary();
      const prev = left;
      left = (x) => {
        const a = prev(x);
        const b = right(x);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
        return a ** b;
      };
    }
    return left;
  }

  function parseMul() {
    let left = parsePow();
    // Implicit multiplication: 2x, 2sin(x), (x+1)(x-1), xpi
    while (true) {
      const t = peek();
      if (t?.type === '*' || t?.type === '/') {
        const op = t.type;
        consume();
        const right = parsePow();
        const prev = left;
        left = op === '*'
          ? (x) => prev(x) * right(x)
          : (x) => {
            const d = right(x);
            return d === 0 ? NaN : prev(x) / d;
          };
        continue;
      }
      if (
        t
        && (t.type === 'number' || t.type === 'ident' || t.type === '(')
      ) {
        const right = parsePow();
        const prev = left;
        left = (x) => prev(x) * right(x);
        continue;
      }
      break;
    }
    return left;
  }

  function parseAdd() {
    let left = parseMul();
    while (peek()?.type === '+' || peek()?.type === '-') {
      const op = peek().type;
      consume();
      const right = parseMul();
      const prev = left;
      left = op === '+'
        ? (x) => prev(x) + right(x)
        : (x) => prev(x) - right(x);
    }
    return left;
  }

  const fn = parseAdd();
  if (pos < tokens.length) throw new Error('表达式末尾有多余内容');
  return fn;
}

/** Strip optional y= / f(x)= prefix */
export function normalizeExprInput(raw) {
  let s = String(raw ?? '').trim();
  if (!s) return '';
  s = s.replace(/^(y|f\s*\(\s*x\s*\))\s*=\s*/i, '');
  return s.trim();
}

/**
 * Compile expression string to f(x) -> number.
 * @returns {{ ok: true, eval: (x:number)=>number } | { ok: false, error: string }}
 */
export function compileExpr(raw) {
  const normalized = normalizeExprInput(raw);
  if (!normalized) {
    return { ok: true, eval: () => NaN, empty: true };
  }
  try {
    const tokens = tokenize(normalized);
    if (tokens.length === 0) return { ok: true, eval: () => NaN, empty: true };
    const evalFn = parseExpression(tokens);
    // smoke test
    evalFn(0);
    return {
      ok: true,
      eval: (x) => {
        try {
          const y = evalFn(x);
          return Number.isFinite(y) ? y : NaN;
        } catch {
          return NaN;
        }
      },
    };
  } catch (error) {
    return { ok: false, error: error?.message || '表达式无效' };
  }
}
