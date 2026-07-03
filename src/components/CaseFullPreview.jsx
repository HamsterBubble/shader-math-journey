import React, { memo } from 'react';
import InstructionPanel from './InstructionPanel.jsx';
import { ExternalLink } from 'lucide-react';

function CaseFullPreview({ caseInfo, onOpenKnowledge }) {
  const lesson = {
    id: `${caseInfo.id}-overview`,
    instructions: caseInfo.overview,
    goalCode: null,
  };

  return (
    <div className="workspace case-full-preview">
      <InstructionPanel lesson={lesson} onOpenKnowledge={onOpenKnowledge} />
      <div className="case-iframe-wrap">
        <div className="case-iframe-header">
          <span>完整交互预览</span>
          <a
            href={caseInfo.fullPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="case-iframe-popout"
          >
            <ExternalLink size={13} />
            新窗口打开
          </a>
        </div>
        <iframe
          src={caseInfo.fullPreviewUrl}
          title={`${caseInfo.title} 完整预览`}
          className="case-iframe"
          allow="autoplay"
        />
      </div>
    </div>
  );
}

export default memo(CaseFullPreview);
