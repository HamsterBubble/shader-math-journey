import React, { memo, useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';

function PracticeSketchList({
  sketches,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onRename,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');

  const startRename = useCallback((sketch, e) => {
    e.stopPropagation();
    setEditingId(sketch.id);
    setDraftTitle(sketch.title);
  }, []);

  const commitRename = useCallback(() => {
    if (editingId && draftTitle.trim()) {
      onRename(editingId, draftTitle.trim());
    }
    setEditingId(null);
  }, [editingId, draftTitle, onRename]);

  return (
    <aside className="practice-sketch-list">
      <div className="practice-sketch-list-header">
        <span>练习列表</span>
        <button type="button" className="practice-sketch-add" onClick={onAdd} title="新建练习">
          <Plus size={14} />
        </button>
      </div>
      <div className="practice-sketch-items">
        {sketches.map((sketch) => (
          <div
            key={sketch.id}
            className={`practice-sketch-item${sketch.id === activeId ? ' active' : ''}`}
            onClick={() => onSelect(sketch.id)}
          >
            {editingId === sketch.id ? (
              <input
                className="practice-sketch-rename"
                value={draftTitle}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setEditingId(null);
                }}
              />
            ) : (
              <span
                className="practice-sketch-title"
                onDoubleClick={(e) => startRename(sketch, e)}
                title="双击重命名"
              >
                {sketch.title}
              </span>
            )}
            <button
              type="button"
              className="practice-sketch-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(sketch.id);
              }}
              title="删除"
              disabled={sketches.length <= 1}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default memo(PracticeSketchList);
