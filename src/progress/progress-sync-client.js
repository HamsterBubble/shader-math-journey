import { PROGRESS_SYNC_API_KEY, PROGRESS_SYNC_ENDPOINT } from './progress-sync-config.js';

export class ProgressSyncException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProgressSyncException';
  }
}

export function parseRemoteProgressSnapshot(json) {
  const payload = json.payload;
  const updatedAt = json.updatedAt;
  return {
    exists: json.exists ?? false,
    payload: payload && typeof payload === 'object' ? payload : null,
    updatedAt: typeof updatedAt === 'string' ? updatedAt : null,
  };
}

export async function fetchRemoteProgress({
  endpoint = PROGRESS_SYNC_ENDPOINT,
  apiKey = PROGRESS_SYNC_API_KEY,
} = {}) {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'x-progress-key': apiKey,
    },
  });
  return parseSyncResponse(response);
}

export async function replaceRemoteProgress(payload, {
  endpoint = PROGRESS_SYNC_ENDPOINT,
  apiKey = PROGRESS_SYNC_API_KEY,
} = {}) {
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-progress-key': apiKey,
    },
    body: JSON.stringify(payload),
  });
  return parseSyncResponse(response);
}

async function parseSyncResponse(response) {
  if (response.status < 200 || response.status >= 300) {
    throw new ProgressSyncException(`同步服务返回 ${response.status}`);
  }

  let decoded;
  try {
    decoded = await response.json();
  } catch {
    throw new ProgressSyncException('同步服务返回格式无效');
  }

  if (!decoded || typeof decoded !== 'object') {
    throw new ProgressSyncException('同步服务返回格式无效');
  }

  return parseRemoteProgressSnapshot(decoded);
}
