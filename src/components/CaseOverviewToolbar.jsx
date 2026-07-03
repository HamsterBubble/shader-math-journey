import React, { memo } from 'react';
import { ExternalLink } from 'lucide-react';

function CaseOverviewToolbar({ caseInfo }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">{caseInfo?.title}</span>
        <span className="toolbar-badge">完整预览</span>
      </div>
      <div className="toolbar-right">
        {caseInfo?.fullPreviewUrl && (
          <a
            className="btn"
            href={caseInfo.fullPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="新窗口打开"
          >
            <ExternalLink size={14} />
            <span>新窗口打开</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default memo(CaseOverviewToolbar);
