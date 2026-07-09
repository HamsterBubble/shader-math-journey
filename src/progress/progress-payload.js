import { loadPracticeSketches, validatePracticeSketches } from '../practice/practice-sketches.js';
import { loadGraphBoards, validateGraphBoards } from '../graph/graph-boards.js';

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

export function toProgressPayload(
  completedLessons,
  practiceSketches = loadPracticeSketches(),
  graphBoards = loadGraphBoards(),
) {
  return {
    completedLessons,
    practiceSketches: validatePracticeSketches(practiceSketches),
    graphBoards: validateGraphBoards(graphBoards),
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
    graphBoards: validateGraphBoards(payload.graphBoards),
  };
}

export function encodeProgressPayload(
  completedLessons,
  practiceSketches = loadPracticeSketches(),
  graphBoards = loadGraphBoards(),
) {
  return JSON.stringify(toProgressPayload(completedLessons, practiceSketches, graphBoards));
}

export function isEmptyProgress(
  completedLessons,
  practiceSketches = loadPracticeSketches(),
  graphBoards = loadGraphBoards(),
) {
  return encodeProgressPayload(completedLessons, practiceSketches, graphBoards)
    === encodeProgressPayload([], [], []);
}
