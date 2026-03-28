import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { ShaderRenderer } from '../core/shader-renderer.js';
import KnowledgeModal from './KnowledgeModal.jsx';

/**
 * InstructionPanel renders lesson instructions (HTML string) and
 * auto-initializes any goal-preview canvases found inside.
 *
 * Knowledge-point links in HTML:
 *   <a class="knowledge-link" data-page="/learn-uv-remap.html" data-title="UV 坐标变换">📖 知识点</a>
 * Clicking opens a modal with the corresponding page.
 */
function InstructionPanel({ lesson }) {
  const containerRef = useRef(null);
  const goalRendererRef = useRef(null);
  const [knowledgeModal, setKnowledgeModal] = useState(null);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [lesson.id]);

  // Initialize goal preview canvas when lesson has goalCode
  useEffect(() => {
    // Cleanup previous goal renderer
    if (goalRendererRef.current) {
      goalRendererRef.current.destroy();
      goalRendererRef.current = null;
    }

    if (!lesson.goalCode || !containerRef.current) return;

    // Find the goal canvas inside the rendered HTML
    const canvas = containerRef.current.querySelector('.goal-canvas');
    if (canvas) {
      const renderer = new ShaderRenderer(canvas);
      renderer.setShader(lesson.goalCode);
      renderer.start();
      goalRendererRef.current = renderer;
    }

    return () => {
      if (goalRendererRef.current) {
        goalRendererRef.current.destroy();
        goalRendererRef.current = null;
      }
    };
  }, [lesson.id, lesson.goalCode]);

  // Handle clicks on knowledge-link elements (event delegation)
  const handleClick = useCallback((e) => {
    const link = e.target.closest('.knowledge-link');
    if (link) {
      e.preventDefault();
      const page = link.dataset.page;
      const title = link.dataset.title || '知识点';
      if (page) {
        setKnowledgeModal({ src: page, title });
      }
    }
  }, []);

  const closeModal = useCallback(() => setKnowledgeModal(null), []);

  return (
    <>
      <div
        className="instructions"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: lesson.instructions }}
        onClick={handleClick}
      />
      {knowledgeModal && (
        <KnowledgeModal
          src={knowledgeModal.src}
          title={knowledgeModal.title}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default memo(InstructionPanel);
