import {
  encodeProgressPayload,
  fromProgressPayload,
  isEmptyProgress,
  saveCompletedLessons,
  toProgressPayload,
} from './progress-payload.js';
import { fetchRemoteProgress, ProgressSyncException, replaceRemoteProgress } from './progress-sync-client.js';
import {
  loadProgressSyncMetadata,
  saveProgressSyncMetadata,
} from './progress-sync-metadata.js';
import { loadPracticeSketches, savePracticeSketches } from '../practice/practice-sketches.js';
import { loadGraphBoards, saveGraphBoards } from '../graph/graph-boards.js';

export const ProgressSyncStatus = {
  idle: 'idle',
  syncing: 'syncing',
  synced: 'synced',
  conflict: 'conflict',
  failed: 'failed',
};

export function createProgressSyncController({
  getCompletedLessons,
  replaceCompletedLessons,
  getPracticeSketches = loadPracticeSketches,
  replacePracticeSketches = savePracticeSketches,
  getGraphBoards = loadGraphBoards,
  replaceGraphBoards = saveGraphBoards,
  fetchRemote = fetchRemoteProgress,
  replaceRemote = replaceRemoteProgress,
  loadMetadata = loadProgressSyncMetadata,
  saveMetadata = saveProgressSyncMetadata,
} = {}) {
  let status = ProgressSyncStatus.idle;
  let message = null;
  let lastSyncedRemoteUpdatedAt = null;
  let conflictRemotePayload = null;
  let conflictRemoteUpdatedAt = null;
  let isSyncing = false;
  let syncAgainRequested = false;
  const listeners = new Set();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function setStatus(nextStatus, nextMessage = null) {
    status = nextStatus;
    message = nextMessage;
    notify();
  }

  function hasConflict() {
    return status === ProgressSyncStatus.conflict;
  }

  function clearConflict() {
    conflictRemotePayload = null;
    conflictRemoteUpdatedAt = null;
  }

  function remoteChanged(remote, metadata) {
    if (!remote.exists) return metadata.lastRemoteUpdatedAt != null;
    return remote.updatedAt !== metadata.lastRemoteUpdatedAt;
  }

  function validRemotePayload(remote) {
    if (!remote.payload) {
      throw new ProgressSyncException('服务器进度格式无效');
    }
    return remote.payload;
  }

  async function saveSyncedMetadata(remoteUpdatedAt, payloadJson) {
    lastSyncedRemoteUpdatedAt = remoteUpdatedAt;
    await saveMetadata({
      lastRemoteUpdatedAt: remoteUpdatedAt,
      lastSyncedPayloadJson: payloadJson,
    });
  }

  function getLocalSnapshot() {
    const completedLessons = getCompletedLessons();
    const practiceSketches = getPracticeSketches();
    const graphBoards = getGraphBoards();
    return {
      completedLessons,
      practiceSketches,
      graphBoards,
      json: encodeProgressPayload(completedLessons, practiceSketches, graphBoards),
    };
  }

  async function upload(completedLessons, practiceSketches, graphBoards, localJson) {
    const response = await replaceRemote(toProgressPayload(completedLessons, practiceSketches, graphBoards));
    await saveSyncedMetadata(response.updatedAt, localJson);
    setStatus(ProgressSyncStatus.synced, '已同步');
  }

  async function download(completedLessons, practiceSketches, graphBoards, remoteUpdatedAt, remoteJson) {
    replaceCompletedLessons(completedLessons);
    saveCompletedLessons(completedLessons);
    replacePracticeSketches(practiceSketches);
    replaceGraphBoards(graphBoards);
    await saveSyncedMetadata(remoteUpdatedAt, remoteJson);
    setStatus(ProgressSyncStatus.synced, '已同步');
  }

  function setConflict(payload, updatedAt) {
    conflictRemotePayload = payload;
    conflictRemoteUpdatedAt = updatedAt;
    setStatus(ProgressSyncStatus.conflict, '本机和服务器进度都已变化');
  }

  async function syncOnce(overrideLessons) {
    setStatus(ProgressSyncStatus.syncing, '正在同步...');
    try {
      const metadata = loadMetadata();
      lastSyncedRemoteUpdatedAt = metadata.lastRemoteUpdatedAt;

      const localLessons = overrideLessons ?? getCompletedLessons();
      const localSketches = getPracticeSketches();
      const localBoards = getGraphBoards();
      const localJson = encodeProgressPayload(localLessons, localSketches, localBoards);
      const localIsEmpty = isEmptyProgress(localLessons, localSketches, localBoards);

      const remote = await fetchRemote();
      const remoteHasChanged = remoteChanged(remote, metadata);
      const localHasChanged =
        metadata.lastSyncedPayloadJson == null
          ? !localIsEmpty
          : localJson !== metadata.lastSyncedPayloadJson;

      if (!remote.exists) {
        if (localIsEmpty) {
          await saveSyncedMetadata(null, localJson);
          setStatus(ProgressSyncStatus.synced, '已同步');
          return;
        }
        await upload(localLessons, localSketches, localBoards, localJson);
        return;
      }

      const remotePayload = validRemotePayload(remote);
      const remoteData = fromProgressPayload(remotePayload);
      const remoteJson = encodeProgressPayload(
        remoteData.completedLessons,
        remoteData.practiceSketches,
        remoteData.graphBoards,
      );

      if (metadata.lastSyncedPayloadJson == null) {
        // No sync history on this browser: if there are no local completed lessons,
        // prefer remote. Default Graph Lab boards / blank practice sketches must not
        // block restoring completedLessons on a new machine.
        if (localIsEmpty || localLessons.length === 0) {
          await download(
            remoteData.completedLessons,
            remoteData.practiceSketches,
            remoteData.graphBoards,
            remote.updatedAt,
            remoteJson,
          );
        } else {
          setConflict(remotePayload, remote.updatedAt);
        }
        return;
      }

      if (localHasChanged && remoteHasChanged) {
        setConflict(remotePayload, remote.updatedAt);
      } else if (localHasChanged) {
        await upload(localLessons, localSketches, localBoards, localJson);
      } else if (remoteHasChanged) {
        await download(
          remoteData.completedLessons,
          remoteData.practiceSketches,
          remoteData.graphBoards,
          remote.updatedAt,
          remoteJson,
        );
      } else {
        setStatus(ProgressSyncStatus.synced, '已同步');
      }
    } catch (error) {
      setStatus(ProgressSyncStatus.failed, messageFor(error));
    }
  }

  async function sync(overrideLessons) {
    if (isSyncing) {
      syncAgainRequested = true;
      return;
    }
    if (hasConflict()) return;

    isSyncing = true;
    try {
      do {
        syncAgainRequested = false;
        await syncOnce(overrideLessons);
        overrideLessons = undefined;
      } while (syncAgainRequested && !hasConflict());
    } finally {
      isSyncing = false;
      notify();
    }
  }

  async function onLocalProgressSaved(overrideLessons) {
    if (hasConflict()) return;
    await sync(overrideLessons);
  }

  async function useLocalForConflict() {
    if (!hasConflict()) return;

    setStatus(ProgressSyncStatus.syncing, '正在上传本机进度...');
    try {
      const localLessons = getCompletedLessons();
      const localSketches = getPracticeSketches();
      const localBoards = getGraphBoards();
      const localJson = encodeProgressPayload(localLessons, localSketches, localBoards);
      const response = await replaceRemote(toProgressPayload(localLessons, localSketches, localBoards));
      await saveSyncedMetadata(response.updatedAt, localJson);
      clearConflict();
      setStatus(ProgressSyncStatus.synced, '已同步');
    } catch (error) {
      setStatus(ProgressSyncStatus.conflict, messageFor(error));
    }
  }

  async function useRemoteForConflict() {
    if (!hasConflict() || !conflictRemotePayload || conflictRemoteUpdatedAt == null) return;

    setStatus(ProgressSyncStatus.syncing, '正在使用服务器进度...');
    try {
      const remoteData = fromProgressPayload(conflictRemotePayload);
      const remoteJson = encodeProgressPayload(
        remoteData.completedLessons,
        remoteData.practiceSketches,
        remoteData.graphBoards,
      );
      await download(
        remoteData.completedLessons,
        remoteData.practiceSketches,
        remoteData.graphBoards,
        conflictRemoteUpdatedAt,
        remoteJson,
      );
      clearConflict();
      setStatus(ProgressSyncStatus.synced, '已同步');
    } catch (error) {
      setStatus(ProgressSyncStatus.conflict, messageFor(error));
    }
  }

  function messageFor(error) {
    if (error instanceof ProgressSyncException) return error.message;
    if (error instanceof SyntaxError) return `无法读取服务器进度：${error.message}`;
    return '同步失败';
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get status() {
      return status;
    },
    get message() {
      return message;
    },
    get lastSyncedRemoteUpdatedAt() {
      return lastSyncedRemoteUpdatedAt;
    },
    get isSyncing() {
      return isSyncing;
    },
    get hasConflict() {
      return hasConflict();
    },
    sync,
    onLocalProgressSaved,
    useLocalForConflict,
    useRemoteForConflict,
  };
}
