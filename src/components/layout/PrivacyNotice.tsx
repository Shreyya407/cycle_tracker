import React, { useState } from 'react';

export const PrivacyNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-surface-container-low border-b border-outline-variant/20 px-4 py-2.5 text-xs text-on-surface-variant flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 max-w-container-max mx-auto w-full">
        <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
        <span>
          <strong>Privacy & Observation Notice:</strong> CycleCare provides personal tracking observations based on your historical data. Insights are not medical diagnoses or treatment recommendations.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-on-surface-variant/70 hover:text-on-surface p-1 rounded transition-colors"
        aria-label="Dismiss notice"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

export default PrivacyNotice;
