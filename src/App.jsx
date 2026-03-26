import React, { useState, useCallback, useRef } from 'react';
import { stages, lessons } from './lessons/index.js';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import InstructionPanel from './components/InstructionPanel.jsx';
import PreviewCanvas from './components/PreviewCanvas.jsx';
import CodeEditor from './components/CodeEditor.jsx';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compileStatus, setCompileStatus] = useState({ ok: true, error: null });
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

  return (
    <div className="app">
      <Sidebar
        stages={stages}
        lessons={lessons}
        currentIndex={currentIndex}
        onSelectLesson={handleLessonChange}
      />
      <div className="main">
        <Toolbar
          title={lesson.title}
          badge={lesson.badge}
          onReset={handleReset}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < lessons.length - 1}
        />
        <div className="workspace">
          <InstructionPanel
            lesson={lesson}
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
    </div>
  );
}
