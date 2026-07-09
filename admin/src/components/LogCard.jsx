import React from 'react';

export default function LogCard({ title, subtitle, mainValue, subValue, tag, type }) {
  // type can be 'in', 'out', or 'neutral'
  const amountClass = type === 'in' ? 'in' : type === 'out' ? 'out' : '';
  const tagClass = type === 'in' ? 'in' : type === 'out' ? 'out' : 'neutral';

  return (
    <div className="paper-card">
      <div className="paper-card-top">
        <div>
          <div className="paper-desc">{title}</div>
          <div className="paper-date">{subtitle}</div>
          {subValue && <div className="paper-date" style={{marginTop: '8px', color: 'var(--ink)'}}>{subValue}</div>}
        </div>
        <div className={`paper-amount ${amountClass}`}>
          {mainValue}
        </div>
      </div>
      {tag && (
        <span className={`paper-tag ${tagClass}`}>
          {tag}
        </span>
      )}
    </div>
  );
}
