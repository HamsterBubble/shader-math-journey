import React, { useState, useCallback, useRef } from 'react';

import { stages, lessons } from './lessons/index.js';

import Sidebar from './components/Sidebar.jsx';

import Toolbar from './components/Toolbar.jsx';

import InstructionPanel from './components/InstructionPanel.jsx';

import PreviewCanvas from './components/PreviewCanvas.jsx';

import CodeEditor from './components/CodeEditor.jsx';

import KnowledgePanel from './components/KnowledgePanel.jsx';

import PracticeArena from './components/PracticeArena.jsx';

import GraphLab from './components/GraphLab.jsx';

import { useProgressSync } from './hooks/useProgressSync.js';

import { loadCompletedLessons, saveCompletedLessons } from './progress/progress-payload.js';

import { resolvePublicPath } from './utils/public-path.js';

const PRACTICE_ARENA_SESSION_KEY = 'practiceArenaSession';

function loadPracticeArenaSession() {
  try {
    const stored = sessionStorage.getItem(PRACTICE_ARENA_SESSION_KEY);
    const session = stored ? JSON.parse(stored) : null;
    if (!session?.activeId) return null;
    return {
      mode: 'blank',
      demoCode: null,
      entry: 'restore',
      initialActiveId: session.activeId,
      sessionId: Date.now(),
    };
  } catch {
    return null;
  }
}

function savePracticeArenaSession(session) {
  try {
    if (!session?.activeId) return;
    sessionStorage.setItem(PRACTICE_ARENA_SESSION_KEY, JSON.stringify({
      activeId: session.activeId,
    }));
  } catch {
    // session restore is best-effort only
  }
}

function clearPracticeArenaSession() {
  try {
    sessionStorage.removeItem(PRACTICE_ARENA_SESSION_KEY);
  } catch {
    // session restore is best-effort only
  }
}



export default function App() {

  const [completedLessons, setCompletedLessons] = useState(loadCompletedLessons);



  const progressSync = useProgressSync({ completedLessons, setCompletedLessons });



  const [currentIndex, setCurrentIndex] = useState(() => {

    const completed = loadCompletedLessons();

    const idx = lessons.findIndex((lesson) => !completed.includes(lesson.id));

    return idx >= 0 ? idx : 0;

  });



  const [compileStatus, setCompileStatus] = useState({ ok: true, error: null });

  const [selectedKnowledge, setSelectedKnowledge] = useState(null);

  const [knowledgeOpen, setKnowledgeOpen] = useState(() => {
    const stored = localStorage.getItem('knowledgePanelOpen');
    return stored === null ? true : stored === 'true';
  });

  const [practiceArena, setPracticeArena] = useState(loadPracticeArenaSession);

  const [graphLabOpen, setGraphLabOpen] = useState(false);



  const toggleLessonComplete = useCallback((id) => {

    setCompletedLessons((prev) => {

      const next = prev.includes(id)

        ? prev.filter((lessonId) => lessonId !== id)

        : [...prev, id];

      saveCompletedLessons(next);

      progressSync.onLocalProgressSaved(next);

      return next;

    });

  }, [progressSync]);



  const rendererRef = useRef(null);

  const editorRef = useRef(null);



  const lesson = lessons[currentIndex];



  const handleCompile = useCallback((code) => {

    if (!rendererRef.current) return;

    const result = rendererRef.current.setShader(code);

    setCompileStatus(result.ok ? { ok: true, error: null } : { ok: false, error: result.error });

    return result;

  }, []);



  const handleLessonChange = useCallback((index) => {

    setCurrentIndex(index);

    setCompileStatus({ ok: true, error: null });

    clearPracticeArenaSession();

    setPracticeArena(null);

  }, []);



  const handleReset = useCallback(() => {

    const code = lessons[currentIndex].code;

    if (editorRef.current) {

      editorRef.current.setValue(code);

    }

    handleCompile(code);

  }, [currentIndex, handleCompile]);



  const handleOpenKnowledge = useCallback((kp) => {
    setKnowledgeOpen(true);
    localStorage.setItem('knowledgePanelOpen', 'true');
    setSelectedKnowledge({
      ...kp,
      src: resolvePublicPath(kp.src),
    });
  }, []);

  const handleToggleKnowledge = useCallback(() => {
    setKnowledgeOpen((prev) => {
      const next = !prev;
      localStorage.setItem('knowledgePanelOpen', String(next));
      return next;
    });
  }, []);



  const handleOpenPracticeArena = useCallback((mode = 'blank', demoCode = null, entry = 'enter') => {
    const isDemo = mode === 'demo';
    setPracticeArena({
      mode: isDemo ? 'demo' : 'blank',
      demoCode: isDemo ? demoCode : null,
      entry,
      lessonId: isDemo ? lesson.id : null,
      title: isDemo ? lesson.title : null,
      sessionId: Date.now(),
    });
  }, [lesson.id, lesson.title]);

  const handleJoinPracticeFromEditor = useCallback(() => {
    const code = editorRef.current?.getValue() ?? lesson.code;
    handleOpenPracticeArena('demo', code, 'join');
  }, [lesson.code, handleOpenPracticeArena]);



  const handleClosePracticeArena = useCallback(() => {

    clearPracticeArenaSession();
    setPracticeArena(null);

  }, []);

  const handleOpenGraphLab = useCallback(() => {
    setGraphLabOpen(true);
  }, []);

  const handleCloseGraphLab = useCallback(() => {
    setGraphLabOpen(false);
  }, []);

  const handlePracticeArenaSessionChange = useCallback((session) => {
    savePracticeArenaSession(session);
  }, []);



  return (

    <div className="app">

      <Sidebar

        stages={stages}

        lessons={lessons}

        currentIndex={currentIndex}

        completedLessons={completedLessons}

        onSelectLesson={handleLessonChange}

        progressSync={progressSync}

      />

      <div className="main">

        <Toolbar
          title={lesson.title}
          badge={lesson.badge}
          isCompleted={completedLessons.includes(lesson.id)}
          onToggleComplete={() => toggleLessonComplete(lesson.id)}
          onOpenPractice={() => handleOpenPracticeArena('blank', null, 'enter')}
          onOpenGraphLab={handleOpenGraphLab}
          onReset={handleReset}
          knowledgeOpen={knowledgeOpen}
          onToggleKnowledge={handleToggleKnowledge}
        />

        <div className="workspace">

          <InstructionPanel

            lesson={lesson}

            onOpenKnowledge={handleOpenKnowledge}

            onOpenPracticeArena={handleOpenPracticeArena}

          />

          <div className="editor-preview">

            <PreviewCanvas

              lesson={lesson}

              compileStatus={compileStatus}

              rendererRef={rendererRef}

              onCompile={handleCompile}

            />

            <div className="editor-area">

              <div className="editor-tabs">
                <div className="editor-tab">fragment.glsl</div>
                <button
                  type="button"
                  className="editor-practice-btn"
                  onClick={handleJoinPracticeFromEditor}
                  title="以当前代码为演示，打开双列练习场"
                >
                  加入练习场
                </button>
              </div>

              <CodeEditor

                lesson={lesson}

                editorRef={editorRef}

                compileStatus={compileStatus}

                onCompile={handleCompile}

              />

            </div>

          </div>

        </div>

      </div>

      <KnowledgePanel
        open={knowledgeOpen}
        selectedKnowledge={selectedKnowledge}
        onSelect={handleOpenKnowledge}
        onBack={() => setSelectedKnowledge(null)}
      />

      <PracticeArena
        open={!!practiceArena}
        onClose={handleClosePracticeArena}
        mode={practiceArena?.mode ?? 'blank'}
        entry={practiceArena?.entry ?? 'enter'}
        sessionId={practiceArena?.sessionId}
        initialActiveId={practiceArena?.initialActiveId}
        title={practiceArena?.title ?? null}
        lessonId={practiceArena?.lessonId ?? null}
        demoCode={practiceArena?.demoCode ?? null}
        completedLessons={completedLessons}
        onSessionChange={handlePracticeArenaSessionChange}
      />

      <GraphLab
        open={graphLabOpen}
        onClose={handleCloseGraphLab}
        completedLessons={completedLessons}
      />

    </div>

  );

}

