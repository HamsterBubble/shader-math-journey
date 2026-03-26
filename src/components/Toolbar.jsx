import React, { memo } from 'react';

function Toolbar({ title, badge, onReset, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">{title}</span>
        <span className="toolbar-badge">{badge}</span>
      </div>
      <div className="toolbar-right">
        <button className="btn" onClick={onReset}>↺ 重置</button>
        <button className="btn primary" onClick={onPrev} disabled={!hasPrev}>← 上一课</button>
        <button className="btn primary" onClick={onNext} disabled={!hasNext}>下一课 →</button>
      </div>
    </div>
  );
}

export default memo(Toolbar);
