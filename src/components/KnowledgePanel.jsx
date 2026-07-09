import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { KNOWLEDGE_POINTS } from '../config/knowledge.js';

function KnowledgePanel({ open = true, selectedKnowledge, onSelect, onBack, highlightIds = null }) {
  const [width, setWidth] = useState(() => {
    const w = localStorage.getItem('knowledgePanelWidth');
    return w ? parseInt(w, 10) : 320;
  });
  const widthRef = useRef(width);

  useEffect(() => {
    widthRef.current = width;
    localStorage.setItem('knowledgePanelWidth', width);
  }, [width]);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    // Create a full-screen overlay to prevent iframes from capturing mouse events
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:col-resize;';
    document.body.appendChild(overlay);

    const startWidth = widthRef.current;
    const startX = e.clientX;

    const onMouseMove = (moveEvt) => {
      const deltaX = startX - moveEvt.clientX;
      let newWidth = startWidth + deltaX;
      if (newWidth < 260) newWidth = 260;
      if (newWidth > Math.min(800, window.innerWidth - 100)) newWidth = Math.min(800, window.innerWidth - 100);
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      overlay.remove();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, []);

  const containerStyle = {
    width: open ? width : 0,
    minWidth: open ? width : 0,
  };

  const contentStyle = {
    width: width,
  };

  const highlighted = highlightIds
    ? KNOWLEDGE_POINTS.filter((kp) => highlightIds.includes(kp.id))
    : [];
  const highlightedSet = new Set(highlightIds ?? []);
  const otherPoints = highlightIds
    ? KNOWLEDGE_POINTS.filter((kp) => !highlightedSet.has(kp.id))
    : KNOWLEDGE_POINTS;

  return (
    <div
      className={`knowledge-panel${open ? '' : ' is-collapsed'}`}
      style={containerStyle}
      aria-hidden={!open}
    >
      {open && (
        <div className="knowledge-panel-drag" onMouseDown={startDrag} title="拖动调整宽度" />
      )}

      <div className="knowledge-panel-content" style={contentStyle}>
        {selectedKnowledge ? (
          <div className="kp-detail">
            <div className="kp-header">
              <button className="kp-back-btn" onClick={onBack}>
                <ArrowLeft size={16} /> 返回
              </button>
              <span className="kp-title">{selectedKnowledge.title}</span>
            </div>
            <iframe
              src={selectedKnowledge.src}
              className="kp-iframe"
              title={selectedKnowledge.title}
            />
          </div>
        ) : (
          <div className="kp-list-view">
            <div className="kp-header">
              <BookOpen size={18} className="kp-icon" />
              <span className="kp-title">{highlightIds ? '本案例知识点' : 'Shader 知识库'}</span>
            </div>
            {highlighted.length > 0 && (
              <div className="kp-list kp-list-highlight">
                {highlighted.map(kp => (
                  <div
                    key={kp.id}
                    className="kp-list-item kp-list-item-case"
                    onClick={() => onSelect({ src: kp.page, title: kp.title })}
                  >
                    <span className="kp-item-icon">{kp.icon}</span>
                    <div className="kp-item-info">
                      <div className="kp-item-title">{kp.title}</div>
                      <div className="kp-item-label">{kp.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {highlightIds && otherPoints.length > 0 && (
              <div className="kp-section-label">全部知识点</div>
            )}
            <div className="kp-list">
              {(highlightIds ? otherPoints : KNOWLEDGE_POINTS).map(kp => (
                <div
                  key={kp.id}
                  className="kp-list-item"
                  onClick={() => onSelect({ src: kp.page, title: kp.title })}
                >
                  <span className="kp-item-icon">{kp.icon}</span>
                  <div className="kp-item-info">
                    <div className="kp-item-title">{kp.title}</div>
                    <div className="kp-item-label">{kp.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(KnowledgePanel);
