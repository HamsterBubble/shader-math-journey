import React, { memo, useEffect, useCallback, useState, useRef } from 'react';
import { X, LineChart, Loader2, Cloud } from 'lucide-react';
import GraphWorkspace from './GraphWorkspace.jsx';
import {
  ensureGraphBoards,
  getActiveGraphBoard,
  saveGraphBoards,
} from '../graph/graph-boards.js';
import { saveGraphBoardsToServer } from '../graph/graph-sync.js';

const AUTO_SAVE_MS = 1500;

function GraphLab({ open, onClose, completedLessons }) {
  const [board, setBoard] = useState(() => getActiveGraphBoard());
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const saveTimerRef = useRef(null);
  const skipNextAutoSaveRef = useRef(false);

  const queueAutoSave = useCallback((nextBoard) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      setSaveMessage('正在保存...');
      try {
        await saveGraphBoardsToServer([nextBoard], completedLessons);
        setSaveStatus('saved');
        setSaveMessage('已自动保存');
      } catch (error) {
        setSaveStatus('error');
        setSaveMessage(error?.message || '自动保存失败');
      }
    }, AUTO_SAVE_MS);
  }, [completedLessons]);

  useEffect(() => {
    if (!open) return;
    setBoard(getActiveGraphBoard());
    setSaveStatus('idle');
    setSaveMessage('');
    skipNextAutoSaveRef.current = true;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (skipNextAutoSaveRef.current) {
      skipNextAutoSaveRef.current = false;
      return;
    }
    queueAutoSave(board);
    return () => clearTimeout(saveTimerRef.current);
  }, [board, open, queueAutoSave]);

  const handleBoardChange = useCallback((nextBoard) => {
    const valid = ensureGraphBoards([nextBoard])[0];
    setBoard(valid);
    saveGraphBoards([valid]);
  }, []);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => () => clearTimeout(saveTimerRef.current), []);

  if (!open) return null;

  return (
    <div className="graph-lab-backdrop" onClick={handleBackdropClick}>
      <div className="graph-lab" role="dialog" aria-modal="true" aria-label="函数图像">
        <div className="graph-lab-header">
          <LineChart size={18} className="graph-lab-icon" />
          <span className="graph-lab-title">函数图像</span>
          <div className="graph-lab-actions">
            <span className={`practice-save-hint ${saveStatus}`} title="自动同步到服务器">
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 size={12} className="sync-spin" />
                  {saveMessage}
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Cloud size={12} />
                  {saveMessage}
                </>
              ) : saveStatus === 'error' ? (
                saveMessage
              ) : (
                <>
                  <Cloud size={12} />
                  自动保存
                </>
              )}
            </span>
          </div>
          <button type="button" className="graph-lab-close" onClick={onClose} title="关闭 (Esc)">
            <X size={18} />
          </button>
        </div>
        <div className="graph-lab-body">
          <GraphWorkspace board={board} onChange={handleBoardChange} />
        </div>
      </div>
    </div>
  );
}

export default memo(GraphLab);
