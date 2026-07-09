import React, { memo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle, Circle, ExternalLink } from 'lucide-react';

function CaseToolbar({
  caseInfo,
  step,
  isCompleted,
  onToggleComplete,
  onReset,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">{caseInfo?.title} · {step?.title}</span>
        <span className="toolbar-badge">{step?.badge}</span>
      </div>
      <div className="toolbar-right">
        {caseInfo?.fullPreviewUrl && (
          <a
            className="btn"
            href={caseInfo.fullPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="新窗口打开完整案例"
          >
            <ExternalLink size={14} />
            <span>完整预览</span>
          </a>
        )}
        <button
          className={`btn ${isCompleted ? 'completed-btn' : ''}`}
          onClick={onToggleComplete}
          title={isCompleted ? '取消完成' : '标记完成'}
        >
          {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
          <span>{isCompleted ? '已完成' : '标记完成'}</span>
        </button>
        <button className="btn" onClick={onReset} title="重置代码">
          <RotateCcw size={14} />
          <span>重置</span>
        </button>
        <button className="btn primary" onClick={onPrev} disabled={!hasPrev}>
          <ChevronLeft size={16} />
          <span>上一步</span>
        </button>
        <button className="btn primary" onClick={onNext} disabled={!hasNext}>
          <span>下一步</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(CaseToolbar);
