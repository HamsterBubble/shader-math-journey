import React, { memo } from 'react';
import { RotateCcw, CheckCircle, Circle, FlaskConical, LineChart, PanelRightClose, PanelRightOpen } from 'lucide-react';

function Toolbar({
  title,
  badge,
  isCompleted,
  onToggleComplete,
  onOpenPractice,
  onOpenGraphLab,
  onReset,
  knowledgeOpen,
  onToggleKnowledge,
}) {
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
        <button
          className={`btn ${isCompleted ? 'completed-btn' : ''}`}
          onClick={onToggleComplete}
          title={isCompleted ? '取消完成' : '标记完成'}
        >
          {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
          <span>{isCompleted ? '已完成' : '标记完成'}</span>
        </button>
        <button className="btn graph-toolbar-btn" onClick={onOpenGraphLab} title="打开函数图像">
          <LineChart size={15} />
          <span>函数图像</span>
        </button>
        <button className="btn practice-toolbar-btn" onClick={onOpenPractice} title="打开练习场">
          <FlaskConical size={15} />
          <span>练习场</span>
        </button>
        <button
          className={`btn${knowledgeOpen ? ' active' : ''}`}
          onClick={onToggleKnowledge}
          title={knowledgeOpen ? '折叠知识库' : '展开知识库'}
        >
          {knowledgeOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          <span>知识库</span>
        </button>
      </div>
    </div>
  );
}

export default memo(Toolbar);
