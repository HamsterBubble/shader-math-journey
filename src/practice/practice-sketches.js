import BLANK_SHADER from '../constants/practice-blank.glsl?raw';

const STORAGE_KEY = 'practiceSketches';

function validatePracticeSource(source) {
  if (!source || source.type !== 'lesson') return null;
  if (typeof source.lessonId !== 'string' || typeof source.demoCode !== 'string') return null;
  return {
    type: 'lesson',
    lessonId: source.lessonId,
    title: typeof source.title === 'string' && source.title.trim() ? source.title.trim() : '课程练习',
    demoCode: source.demoCode,
  };
}

export function validatePracticeSketches(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item.id === 'string' && typeof item.code === 'string')
    .map((item) => {
      const source = validatePracticeSource(item.source);
      return {
        id: item.id,
        title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : '未命名练习',
        code: item.code,
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : null,
        ...(source ? { source } : {}),
      };
    });
}

export function isLessonPracticeSketch(sketch) {
  return sketch?.source?.type === 'lesson';
}

export function createPracticeSketch({ title, code = BLANK_SHADER, source = null } = {}) {
  const validSource = validatePracticeSource(source);
  return {
    id: crypto.randomUUID(),
    title: title ?? '未命名练习',
    code,
    updatedAt: new Date().toISOString(),
    ...(validSource ? { source: validSource } : {}),
  };
}

export function loadPracticeSketches() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return validatePracticeSketches(stored ? JSON.parse(stored) : []);
  } catch {
    return [];
  }
}

export function savePracticeSketches(sketches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validatePracticeSketches(sketches)));
}

export function defaultPracticeSketches() {
  return [createPracticeSketch({ title: '练习 1' })];
}

export function ensurePracticeSketches(sketches) {
  const valid = validatePracticeSketches(sketches);
  return valid.length > 0 ? valid : defaultPracticeSketches();
}

export function getLatestSketchId(sketches) {
  const valid = validatePracticeSketches(sketches);
  if (valid.length === 0) return null;
  const latest = [...valid].sort((a, b) => {
    const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    return tb - ta;
  })[0];
  return latest.id;
}

export function getLatestStandaloneSketchId(sketches) {
  return getLatestSketchId(validatePracticeSketches(sketches).filter((sketch) => !isLessonPracticeSketch(sketch)));
}

/** @returns {{ sketches: ReturnType<typeof validatePracticeSketches>, activeId: string, dirty: boolean }} */
export function resolvePracticeSession(sketches, entry, { joinTitle, lessonId, demoCode, activeId } = {}) {
  let next = validatePracticeSketches(sketches);
  let dirty = false;

  if (entry === 'restore' && activeId && next.some((sketch) => sketch.id === activeId)) {
    return { sketches: next, activeId, dirty: false };
  }

  if (entry === 'join') {
    const existingLessonSketch = lessonId
      ? next.find((sketch) => sketch.source?.type === 'lesson' && sketch.source.lessonId === lessonId)
      : null;

    if (existingLessonSketch) {
      const source = {
        type: 'lesson',
        lessonId,
        title: joinTitle?.trim() || existingLessonSketch.source.title,
        demoCode: demoCode ?? existingLessonSketch.source.demoCode,
      };
      next = next.map((sketch) => (
        sketch.id === existingLessonSketch.id ? { ...sketch, title: source.title, source } : sketch
      ));
      savePracticeSketches(next);
      return { sketches: next, activeId: existingLessonSketch.id, dirty: true };
    }

    const sketch = createPracticeSketch({
      title: joinTitle?.trim() || `练习 ${next.length + 1}`,
      source: lessonId && demoCode ? {
        type: 'lesson',
        lessonId,
        title: joinTitle?.trim() || '课程练习',
        demoCode,
      } : null,
    });
    next = [...next, sketch];
    savePracticeSketches(next);
    return { sketches: next, activeId: sketch.id, dirty: true };
  }

  if (next.length === 0) {
    next = defaultPracticeSketches();
    savePracticeSketches(next);
    dirty = true;
  }

  const standaloneId = getLatestStandaloneSketchId(next);
  if (standaloneId) {
    return { sketches: next, activeId: standaloneId, dirty };
  }

  return {
    sketches: next,
    activeId: getLatestSketchId(next),
    dirty,
  };
}
