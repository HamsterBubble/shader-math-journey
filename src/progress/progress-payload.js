const STORAGE_KEY = 'completedLessons';

export function loadCompletedLessons() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCompletedLessons(lessons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

export function toProgressPayload(completedLessons) {
  return { completedLessons };
}

export function fromProgressPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('服务器进度格式无效');
  }
  const lessons = payload.completedLessons;
  if (!Array.isArray(lessons)) {
    throw new Error('服务器进度格式无效');
  }
  return lessons.filter((id) => typeof id === 'string');
}

export function encodeProgressPayload(completedLessons) {
  return JSON.stringify(toProgressPayload(completedLessons));
}

export function isEmptyProgress(completedLessons) {
  return encodeProgressPayload(completedLessons) === encodeProgressPayload([]);
}
