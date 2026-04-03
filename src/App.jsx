import React, { useState, useCallback, useRef } from 'react';
import { stages, lessons } from './lessons/index.js';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import InstructionPanel from './components/InstructionPanel.jsx';
import PreviewCanvas from './components/PreviewCanvas.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import KnowledgePanel from './components/KnowledgePanel.jsx';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const stored = localStorage.getItem('completedLessons');
      const completed = stored ? JSON.parse(stored) : [];
      const idx = lessons.findIndex(l => !completed.includes(l.id));
      return idx >= 0 ? idx : 0;
    } catch {
      return 0;
    }
  });
  const [compileStatus, setCompileStatus] = useState({ ok: true, error: null });
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const stored = localStorage.getItem('completedLessons');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleComplete = useCallback((id) => {
    setCompletedLessons(prev => {
      const next = prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id];
      localStorage.setItem('completedLessons', JSON.stringify(next));
      return next;
    });
  }, []);

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
  }, []);

  const handleReset = useCallback(() => {
    const code = lessons[currentIndex].code;
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
    handleCompile(code);
  }, [currentIndex, handleCompile]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) handleLessonChange(currentIndex - 1);
  }, [currentIndex, handleLessonChange]);

  const handleNext = useCallback(() => {
    if (currentIndex < lessons.length - 1) handleLessonChange(currentIndex + 1);
  }, [currentIndex, handleLessonChange]);

  const handleOpenKnowledge = useCallback((kp) => {
    setSelectedKnowledge(kp);
  }, []);

  return (
    <div className="app">
      <Sidebar
        stages={stages}
        lessons={lessons}
        currentIndex={currentIndex}
        completedLessons={completedLessons}
        onSelectLesson={handleLessonChange}
      />
      <div className="main">
        <Toolbar
          title={lesson.title}
          badge={lesson.badge}
          isCompleted={completedLessons.includes(lesson.id)}
          onToggleComplete={() => toggleComplete(lesson.id)}
          onReset={handleReset}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < lessons.length - 1}
        />
        <div className="workspace">
          <InstructionPanel
            lesson={lesson}
            onOpenKnowledge={handleOpenKnowledge}
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
        selectedKnowledge={selectedKnowledge}
        onSelect={setSelectedKnowledge}
        onBack={() => setSelectedKnowledge(null)}
      />
    </div>
  );
}
