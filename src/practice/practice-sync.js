import { fetchRemoteProgress, replaceRemoteProgress, ProgressSyncException } from '../progress/progress-sync-client.js';
import { encodeProgressPayload, fromProgressPayload, toProgressPayload } from '../progress/progress-payload.js';
import { savePracticeSketches, validatePracticeSketches } from './practice-sketches.js';
import { saveProgressSyncMetadata } from '../progress/progress-sync-metadata.js';

export { ProgressSyncException };

export async function fetchRemotePracticeSketches() {
  const remote = await fetchRemoteProgress();
  if (!remote.exists || !remote.payload) return [];
  const parsed = fromProgressPayload(remote.payload);
  return validatePracticeSketches(parsed.practiceSketches);
}

export async function savePracticeSketchesToServer(practiceSketches, completedLessons) {
  const payload = toProgressPayload(completedLessons, practiceSketches);
  const response = await replaceRemoteProgress(payload);
  savePracticeSketches(practiceSketches);
  saveProgressSyncMetadata({
    lastRemoteUpdatedAt: response.updatedAt,
    lastSyncedPayloadJson: encodeProgressPayload(completedLessons, practiceSketches),
  });
  return response;
}