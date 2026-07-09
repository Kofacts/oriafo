import React from 'react';
import { formatNaira } from '../lib/utils';
import PaperCard from './PaperCard';

export default function Overview({ finance, production, procurement, processing }) {
  // Finance stats
  const given = finance.filter(e => e.type === 'in').reduce((sum, e) => sum + e.amount, 0);
  const spent = finance.filter(e => e.type === 'out').reduce((sum, e) => sum + e.amount, 0);
  const balance = given - spent;

  // Mill stats
  const totalPknCrushed = production.reduce((sum, e) => sum + (e.pknCrushed || 0), 0);
  const totalPkoProduced = production.reduce((sum, e) => sum + (e.pkoProduced || 0), 0);
  const totalProcessingFees = processing.reduce((sum, e) => sum + (e.fee || 0), 0);

  const sortedFinance = [...finance].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const recentActivity = sortedFinance.slice(0, 12);

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Overview</h1>
      <p className="page-sub">High-level summary of mill operations.</p>

      <div className="log-section-title" style={{ marginTop: 0 }}>Finance Summary</div>
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Given to site</div>
          <div className="stat-value given">
            {formatNaira(given)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Spent on site</div>
          <div className="stat-value spent">
            {formatNaira(spent)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Balance remaining</div>
          <div className={`stat-value ${balance >= 0 ? 'balance-pos' : 'balance-neg'}`}>
            {formatNaira(balance)}
          </div>
        </div>
      </div>

      <div className="log-section-title">Operations Summary (All Time)</div>
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total PKN Crushed</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>
            {totalPknCrushed.toFixed(1)} T
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total PKO Produced</div>
          <div className="stat-value" style={{ color: 'var(--accent-soft)' }}>
            {totalPkoProduced.toFixed(1)} T
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Processing Fees Earned</div>
          <div className="stat-value given">
            {formatNaira(totalProcessingFees)}
          </div>
        </div>
      </div>

      <div className="log-section-title">Recent Finance Activity</div>
      <div className="log-list">
        {recentActivity.length > 0 ? (
          recentActivity.map(entry => (
            <PaperCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="empty-state">No finance entries yet. Go to Finance to upload a photo.</div>
        )}
      </div>
    </section>
  );
}
