import React, { memo, useRef, useEffect } from 'react';
import { ShaderRenderer } from '../core/shader-renderer.js';

/**
 * InstructionPanel renders lesson instructions (HTML string) and
 * auto-initializes any goal-preview canvases found inside.
 */
function InstructionPanel({ lesson }) {
  const containerRef = useRef(null);
  const goalRendererRef = useRef(null);

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

  return (
    <div
      className="instructions"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: lesson.instructions }}
    />
  );
}

export default memo(InstructionPanel);
