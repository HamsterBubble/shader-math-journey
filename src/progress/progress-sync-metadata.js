const STORAGE_KEY = 'progressSyncMetadata';

export function loadProgressSyncMetadata() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { lastRemoteUpdatedAt: null, lastSyncedPayloadJson: null };
    const json = JSON.parse(stored);
    return {
      lastRemoteUpdatedAt:
        typeof json.lastRemoteUpdatedAt === 'string' ? json.lastRemoteUpdatedAt : null,
      lastSyncedPayloadJson:
        typeof json.lastSyncedPayloadJson === 'string' ? json.lastSyncedPayloadJson : null,
    };
  } catch {
    return { lastRemoteUpdatedAt: null, lastSyncedPayloadJson: null };
  }
}

export function saveProgressSyncMetadata(metadata) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      lastRemoteUpdatedAt: metadata.lastRemoteUpdatedAt,
      lastSyncedPayloadJson: metadata.lastSyncedPayloadJson,
    }),
  );
}
