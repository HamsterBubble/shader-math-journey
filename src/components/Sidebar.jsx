import React, { memo, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Palette, Check, BookOpen, Trophy, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'course', label: '课程', icon: BookOpen },
  { id: 'challenge', label: '挑战', icon: Trophy },
];

export function isChallenge(lesson) {
  return lesson.badge === '挑战' || !!lesson.goalCode;
}

const LessonItem = memo(function LessonItem({ lesson, displayNum, index, isActive, isCompleted, onSelect, isChallengeItem }) {
  return (
    <div
      className={`lesson-item${isActive ? ' active' : ''}${isCompleted ? ' completed-item' : ''}${isChallengeItem ? ' challenge-item' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className={`lesson-num${isCompleted ? ' is-completed' : ''}${isChallengeItem ? ' challenge-num' : ''}`}>
        {isCompleted ? <Check size={14} strokeWidth={3} /> : isChallengeItem ? '🏆' : displayNum}
      </div>
      <div className="lesson-title">{lesson.title}</div>
    </div>
  );
});

const StageGroup = memo(function StageGroup({
  stage,
  items,
  currentIndex,
  completedLessons,
  onSelectLesson,
  showChallengeLink,
  onViewChallenges,
  isChallengeTab,
}) {
  return (
    <div className="stage-group" data-stage={stage?.id}>
      <div className="stage-label">
        <span className="stage-icon">{stage?.icon || ''}</span>
        <span className="stage-title">{stage?.title || `阶段 ${stage?.id}`}</span>
      </div>
      {items.map((item, i) => (
        <LessonItem
          key={item._index}
          lesson={item}
          displayNum={i + 1}
          index={item._index}
          isActive={item._index === currentIndex}
          isCompleted={completedLessons?.includes(item.id)}
          onSelect={onSelectLesson}
          isChallengeItem={isChallengeTab}
        />
      ))}
      {showChallengeLink && items.length > 0 && (
        <button
          type="button"
          className="view-challenges-btn"
          onClick={() => onViewChallenges(stage?.id)}
        >
          <Trophy size={13} />
          <span>查看相关挑战</span>
          <ChevronRight size={13} className="view-challenges-arrow" />
        </button>
      )}
    </div>
  );
});

function Sidebar({
  stages,
  lessons,
  currentIndex,
  completedLessons = [],
  onSelectLesson,
}) {
  const [activeTab, setActiveTab] = useState('course');
  const listRef = useRef(null);
  const prevIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      const lesson = lessons[currentIndex];
      if (lesson) {
        setActiveTab(isChallenge(lesson) ? 'challenge' : 'course');
      }
    }
  }, [currentIndex, lessons]);

  const { courseGrouped, challengeGrouped, challengeCountByStage } = useMemo(() => {
    const courseGroups = {};
    const challengeGroups = {};
    const challengeCounts = {};

    lessons.forEach((l, i) => {
      const item = { ...l, _index: i };
      if (isChallenge(l)) {
        (challengeGroups[l.stage] ??= []).push(item);
        challengeCounts[l.stage] = (challengeCounts[l.stage] ?? 0) + 1;
      } else {
        (courseGroups[l.stage] ??= []).push(item);
      }
    });

    return {
      courseGrouped: courseGroups,
      challengeGrouped: challengeGroups,
      challengeCountByStage: challengeCounts,
    };
  }, [lessons]);

  const handleViewChallenges = useCallback((stageId) => {
    setActiveTab('challenge');
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(`.stage-group[data-stage="${stageId}"]`);
      el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }, []);

  const courseCount = useMemo(() => lessons.filter(l => !isChallenge(l)).length, [lessons]);
  const challengeCount = useMemo(() => lessons.filter(isChallenge).length, [lessons]);
  const completedCourse = useMemo(
    () => completedLessons.filter(id => lessons.some(l => l.id === id && !isChallenge(l))).length,
    [completedLessons, lessons],
  );
  const completedChallenge = useMemo(
    () => completedLessons.filter(id => lessons.some(l => l.id === id && isChallenge(l))).length,
    [completedLessons, lessons],
  );

  const lessonPct = lessons.length > 0 ? ((completedLessons.length / lessons.length) * 100).toFixed(0) : 0;

  const progressText = activeTab === 'challenge'
    ? `${completedChallenge} / ${challengeCount} 挑战已完成`
    : `${completedCourse} / ${courseCount} 课程已完成`;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Palette size={20} className="sidebar-logo-icon" />
        <h1>Shader 数学之旅</h1>
      </div>

      <div className="sidebar-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <nav className="stage-list" ref={listRef}>
        {activeTab === 'course' && Object.entries(courseGrouped).map(([stageId, items]) => {
          const stage = stages.find(s => s.id === +stageId);
          const hasChallenges = challengeCountByStage[+stageId] > 0;
          return (
            <StageGroup
              key={stageId}
              stage={stage}
              items={items}
              currentIndex={currentIndex}
              completedLessons={completedLessons}
              onSelectLesson={onSelectLesson}
              showChallengeLink={hasChallenges}
              onViewChallenges={handleViewChallenges}
            />
          );
        })}

        {activeTab === 'challenge' && Object.entries(challengeGrouped).map(([stageId, items]) => {
          const stage = stages.find(s => s.id === +stageId);
          return (
            <StageGroup
              key={stageId}
              stage={stage}
              items={items}
              currentIndex={currentIndex}
              completedLessons={completedLessons}
              onSelectLesson={onSelectLesson}
              isChallengeTab
            />
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: `${lessonPct}%` }} />
        </div>
        <span className="prog-text">{progressText}</span>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
