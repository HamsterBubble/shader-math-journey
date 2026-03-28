import React, { memo, useCallback, useEffect } from 'react';
import { BookOpen, Maximize2, Minimize2, X } from 'lucide-react';

/**
 * KnowledgeModal — displays an interactive knowledge-point page in a modal iframe.
 *
 * Props:
 *   src   — URL of the knowledge page (e.g. "/learn-uv-remap.html")
 *   title — modal title
 *   onClose — callback to close the modal
 */
function KnowledgeModal({ src, title, onClose }) {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && !isFullScreen) onClose();
  }, [onClose, isFullScreen]);

  // Key handlers (Escape to close, ` to toggle full screen)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Backquote' || e.key === '`') {
        toggleFullScreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, toggleFullScreen]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className={`knowledge-modal-backdrop ${isFullScreen ? 'is-fullscreen' : ''}`} onClick={handleBackdropClick}>
      <div className={`knowledge-modal ${isFullScreen ? 'is-fullscreen' : ''}`}>
        <div className="knowledge-modal-header">
          <BookOpen size={18} className="knowledge-modal-icon" />
          <span className="knowledge-modal-title">{title}</span>
          <div className="knowledge-modal-actions">
            <button 
              className="knowledge-modal-btn" 
              onClick={toggleFullScreen}
              title={isFullScreen ? "退出全屏 (按 ` 键)" : "全屏显示 (按 ` 键)"}
            >
              {isFullScreen ? (
                <><Minimize2 size={14} /> <span>内嵌</span></>
              ) : (
                <><Maximize2 size={14} /> <span>全屏</span></>
              )}
            </button>
            <button className="knowledge-modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
        <iframe
          className="knowledge-modal-iframe"
          src={src}
          title={title}
        />
      </div>
    </div>
  );
}

export default memo(KnowledgeModal);
