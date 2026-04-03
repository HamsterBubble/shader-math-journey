import React, { memo, useMemo } from 'react';
import { Palette, Check } from 'lucide-react';

const LessonItem = memo(function LessonItem({ lesson, index, isActive, isCompleted, onSelect }) {
  return (
    <div
      className={`lesson-item${isActive ? ' active' : ''}${isCompleted ? ' completed-item' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className={`lesson-num${isCompleted ? ' is-completed' : ''}`}>
        {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
      </div>
      <div className="lesson-title">{lesson.title}</div>
    </div>
  );
});

const StageGroup = memo(function StageGroup({ stage, items, currentIndex, completedLessons, onSelectLesson }) {
  return (
    <div className="stage-group">
      <div className="stage-label">
        <span className="ico">{stage?.icon || ''}</span>
        {stage?.title || `阶段 ${stage?.id}`}
      </div>
      {items.map((item) => (
        <LessonItem
          key={item._index}
          lesson={item}
          index={item._index}
          isActive={item._index === currentIndex}
          isCompleted={completedLessons?.includes(item.id)}
          onSelect={onSelectLesson}
        />
      ))}
    </div>
  );
});

function Sidebar({ stages, lessons, currentIndex, completedLessons = [], onSelectLesson }) {
  const grouped = useMemo(() => {
    const groups = {};
    lessons.forEach((l, i) => {
      (groups[l.stage] ??= []).push({ ...l, _index: i });
    });
    return groups;
  }, [lessons]);

  const pct = lessons.length > 0 ? ((completedLessons.length / lessons.length) * 100).toFixed(0) : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Palette size={20} className="sidebar-logo-icon" />
        <h1>Shader 数学之旅</h1>
      </div>
      <nav className="stage-list">
        {Object.entries(grouped).map(([stageId, items]) => {
          const stage = stages.find(s => s.id === +stageId);
          return (
            <StageGroup
              key={stageId}
              stage={stage}
              items={items}
              currentIndex={currentIndex}
              completedLessons={completedLessons}
              onSelectLesson={onSelectLesson}
            />
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="prog-text">{completedLessons.length} / {lessons.length} 已完成</span>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
