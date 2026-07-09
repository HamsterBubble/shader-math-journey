import { fetchRemoteProgress, replaceRemoteProgress, ProgressSyncException } from '../progress/progress-sync-client.js';
import { encodeProgressPayload, fromProgressPayload, toProgressPayload } from '../progress/progress-payload.js';
import { loadPracticeSketches } from '../practice/practice-sketches.js';
import { saveGraphBoards, validateGraphBoards } from './graph-boards.js';
import { saveProgressSyncMetadata } from '../progress/progress-sync-metadata.js';

export { ProgressSyncException };

export async function saveGraphBoardsToServer(graphBoards, completedLessons, practiceSketches = loadPracticeSketches()) {
  const payload = toProgressPayload(completedLessons, practiceSketches, graphBoards);
  const response = await replaceRemoteProgress(payload);
  saveGraphBoards(graphBoards);
  saveProgressSyncMetadata({
    lastRemoteUpdatedAt: response.updatedAt,
    lastSyncedPayloadJson: encodeProgressPayload(completedLessons, practiceSketches, graphBoards),
  });
  return response;
}

export async function fetchRemoteGraphBoards() {
  const remote = await fetchRemoteProgress();
  if (!remote.exists || !remote.payload) return [];
  const parsed = fromProgressPayload(remote.payload);
  return validateGraphBoards(parsed.graphBoards);
}
