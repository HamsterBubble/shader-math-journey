const STORAGE_KEY = 'graphBoards';

const DEFAULT_VIEW = { xMin: -10, xMax: 10, yMin: -6, yMax: 6 };

export const GRAPH_COLORS = [
  '#58a6ff',
  '#3fb950',
  '#f778ba',
  '#d29922',
  '#bc8cff',
  '#39d2c0',
  '#f85149',
  '#79c0ff',
];

export function createGraphExpression({ expr = 'sin(x)', color, visible = true } = {}, index = 0) {
  return {
    id: crypto.randomUUID(),
    expr,
    color: color ?? GRAPH_COLORS[index % GRAPH_COLORS.length],
    visible,
  };
}

export function createGraphBoard({ title = '函数图像', expressions, view } = {}) {
  return {
    id: crypto.randomUUID(),
    title,
    expressions: expressions ?? [createGraphExpression({ expr: 'sin(x)' }, 0)],
    view: { ...DEFAULT_VIEW, ...(view ?? {}) },
    updatedAt: new Date().toISOString(),
  };
}

function validateBoard(item) {
  if (!item || typeof item !== 'object') return null;
  const expressions = Array.isArray(item.expressions)
    ? item.expressions
      .filter((e) => e && typeof e.id === 'string' && typeof e.expr === 'string')
      .map((e, i) => ({
        id: e.id,
        expr: e.expr,
        color: typeof e.color === 'string' ? e.color : GRAPH_COLORS[i % GRAPH_COLORS.length],
        visible: e.visible !== false,
      }))
    : [createGraphExpression({}, 0)];
  const view = item.view && typeof item.view === 'object'
    ? {
        xMin: Number.isFinite(item.view.xMin) ? item.view.xMin : DEFAULT_VIEW.xMin,
        xMax: Number.isFinite(item.view.xMax) ? item.view.xMax : DEFAULT_VIEW.xMax,
        yMin: Number.isFinite(item.view.yMin) ? item.view.yMin : DEFAULT_VIEW.yMin,
        yMax: Number.isFinite(item.view.yMax) ? item.view.yMax : DEFAULT_VIEW.yMax,
      }
    : { ...DEFAULT_VIEW };
  return {
    id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
    title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : '函数图像',
    expressions: expressions.length > 0 ? expressions : [createGraphExpression({}, 0)],
    view,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : null,
  };
}

/** Always returns a single-board array for progress payload compatibility. */
export function validateGraphBoards(raw) {
  if (Array.isArray(raw) && raw.length > 0) {
    const board = validateBoard(raw[0]);
    return board ? [board] : [createGraphBoard()];
  }
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const board = validateBoard(raw);
    return board ? [board] : [createGraphBoard()];
  }
  return [];
}

export function loadGraphBoards() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ensureGraphBoards(stored ? JSON.parse(stored) : []);
  } catch {
    return [createGraphBoard()];
  }
}

export function saveGraphBoards(boards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureGraphBoards(boards)));
}

export function ensureGraphBoards(boards) {
  const valid = validateGraphBoards(boards);
  return valid.length > 0 ? [valid[0]] : [createGraphBoard()];
}

export function getActiveGraphBoard(boards = loadGraphBoards()) {
  return ensureGraphBoards(boards)[0];
}

export { DEFAULT_VIEW };
