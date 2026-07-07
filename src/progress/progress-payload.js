import { loadPracticeSketches, validatePracticeSketches } from '../practice/practice-sketches.js';

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

export function toProgressPayload(completedLessons, practiceSketches = loadPracticeSketches()) {
  return {
    completedLessons,
    practiceSketches: validatePracticeSketches(practiceSketches),
  };
}

export function fromProgressPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('服务器进度格式无效');
  }
  const lessons = payload.completedLessons;
  if (!Array.isArray(lessons)) {
    throw new Error('服务器进度格式无效');
  }
  return {
    completedLessons: lessons.filter((id) => typeof id === 'string'),
    practiceSketches: validatePracticeSketches(payload.practiceSketches),
  };
}

export function encodeProgressPayload(completedLessons, practiceSketches = loadPracticeSketches()) {
  return JSON.stringify(toProgressPayload(completedLessons, practiceSketches));
}

export function isEmptyProgress(completedLessons, practiceSketches = loadPracticeSketches()) {
  return encodeProgressPayload(completedLessons, practiceSketches)
    === encodeProgressPayload([], []);
}
