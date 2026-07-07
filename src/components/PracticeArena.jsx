import React, { memo, useEffect, useCallback, useState, useRef } from 'react';
import { X, FlaskConical, Loader2, Cloud } from 'lucide-react';
import PracticePane from './PracticePane.jsx';
import PracticeSketchList from './PracticeSketchList.jsx';
import BLANK_SHADER from '../constants/practice-blank.glsl?raw';
import {
  createPracticeSketch,
  ensurePracticeSketches,
  isLessonPracticeSketch,
  loadPracticeSketches,
  resolvePracticeSession,
  savePracticeSketches,
} from '../practice/practice-sketches.js';
import { savePracticeSketchesToServer } from '../practice/practice-sync.js';

const AUTO_SAVE_MS = 1500;

function PracticeArena({
  open,
  onClose,
  mode = 'blank',
  entry = 'enter',
  sessionId,
  initialActiveId,
  title,
  lessonId,
  demoCode,
  completedLessons,
  onSessionChange,
}) {
  const [sketches, setSketches] = useState(() => ensurePracticeSketches(loadPracticeSketches()));
  const [activeId, setActiveId] = useState(() => sketches[0]?.id ?? null);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const saveTimerRef = useRef(null);
  const skipNextAutoSaveRef = useRef(false);

  const activeSketch = sketches.find((s) => s.id === activeId) ?? sketches[0] ?? null;
  const isInlineDemo = mode === 'demo' && entry !== 'join' && !activeSketch?.source;
  const effectiveDemoCode = activeSketch?.source?.demoCode ?? (isInlineDemo ? demoCode : null);
  const isDemo = !!effectiveDemoCode;
  const headerTitle = activeSketch?.source?.title ?? (isInlineDemo ? title : null);

  const queueAutoSave = useCallback((nextSketches) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      setSaveMessage('正在保存...');
      try {
        await savePracticeSketchesToServer(nextSketches, completedLessons);
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
    const session = resolvePracticeSession(loadPracticeSketches(), entry, {
      joinTitle: entry === 'join' ? title : null,
      lessonId,
      demoCode,
      activeId: initialActiveId,
    });
    setSketches(session.sketches);
    setActiveId(session.activeId);
    setSaveStatus('idle');
    setSaveMessage('');
    skipNextAutoSaveRef.current = true;
    if (session.dirty) {
      queueAutoSave(session.sketches);
    }
  }, [open, entry, sessionId, title, lessonId, demoCode, initialActiveId, queueAutoSave]);

  useEffect(() => {
    if (!open) return;
    if (skipNextAutoSaveRef.current) {
      skipNextAutoSaveRef.current = false;
      return;
    }
    queueAutoSave(sketches);
    return () => clearTimeout(saveTimerRef.current);
  }, [sketches, open, queueAutoSave]);

  const persistSketches = useCallback((nextSketches) => {
    const valid = ensurePracticeSketches(nextSketches);
    setSketches(valid);
    savePracticeSketches(valid);
    setActiveId((prev) => (valid.some((s) => s.id === prev) ? prev : valid[0]?.id ?? null));
  }, []);

  const handleSelect = useCallback((id) => {
    setActiveId(id);
  }, []);

  const handleAdd = useCallback(() => {
    const next = createPracticeSketch({
      title: `练习 ${sketches.length + 1}`,
    });
    persistSketches([...sketches, next]);
    setActiveId(next.id);
  }, [sketches, persistSketches]);

  const handleDelete = useCallback((id) => {
    if (sketches.length <= 1) return;
    persistSketches(sketches.filter((s) => s.id !== id));
  }, [sketches, persistSketches]);

  const handleRename = useCallback((id, nextTitle) => {
    persistSketches(sketches.map((s) => (
      s.id === id ? { ...s, title: nextTitle, updatedAt: new Date().toISOString() } : s
    )));
  }, [sketches, persistSketches]);

  const handleCodeChange = useCallback((code) => {
    if (!activeId) return;
    setSketches((prev) => {
      const next = prev.map((s) => (
        s.id === activeId ? { ...s, code, updatedAt: new Date().toISOString() } : s
      ));
      savePracticeSketches(next);
      return next;
    });
  }, [activeId]);

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

  useEffect(() => {
    if (!open || !activeSketch) return;
    onSessionChange?.({
      activeId: activeSketch.id,
      isLessonPractice: isLessonPracticeSketch(activeSketch),
    });
  }, [open, activeSketch, onSessionChange]);

  if (!open) return null;

  return (
    <div className="practice-arena-backdrop" onClick={handleBackdropClick}>
      <div className="practice-arena" role="dialog" aria-modal="true" aria-label="练习场">
        <div className="practice-arena-header">
          <FlaskConical size={18} className="practice-arena-icon" />
          <span className="practice-arena-title">
            练习场{headerTitle ? ` — ${headerTitle}` : ''}
          </span>
          <div className="practice-arena-actions">
            <span className={`practice-save-hint ${saveStatus}`} title="练习列表自动同步到服务器">
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
          <button type="button" className="practice-arena-close" onClick={onClose} title="关闭 (Esc)">
            <X size={18} />
          </button>
        </div>
        <div className="practice-arena-body">
          <PracticeSketchList
            sketches={sketches}
            activeId={activeSketch?.id}
            onSelect={handleSelect}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onRename={handleRename}
          />
          {isDemo ? (
            <PracticePane
              label="演示参考"
              code={effectiveDemoCode}
              codeKey={`demo-${activeSketch?.source?.lessonId ?? sessionId ?? 'inline'}-${effectiveDemoCode.length}`}
              readOnly
            />
          ) : null}
          <PracticePane
            label={isDemo ? '练习区' : null}
            code={activeSketch?.code ?? BLANK_SHADER}
            codeKey={activeSketch?.id ?? 'blank'}
            onCodeChange={handleCodeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(PracticeArena);
