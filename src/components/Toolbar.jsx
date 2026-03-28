import React, { memo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

function Toolbar({ title, badge, onReset, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">{title}</span>
        <span className="toolbar-badge">{badge}</span>
      </div>
      <div className="toolbar-right">
        <button className="btn" onClick={onReset} title="重置代码">
          <RotateCcw size={14} />
          <span>重置</span>
        </button>
        <button className="btn primary" onClick={onPrev} disabled={!hasPrev}>
          <ChevronLeft size={16} />
          <span>上一课</span>
        </button>
        <button className="btn primary" onClick={onNext} disabled={!hasNext}>
          <span>下一课</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(Toolbar);
