import React, { useState } from 'react';
import LogCard from './LogCard';
import { uid } from '../lib/api';
import { formatNaira } from '../lib/utils';

export default function Equipment({ entries, onSaveEntries }) {
  const [date, setDate] = useState('');
  const [asset, setAsset] = useState('Generator (100kVA)');
  const [action, setAction] = useState('Diesel Refill');
  const [cost, setCost] = useState('');

  const handleSave = async () => {
    if (!date || !asset || !action || !cost) {
      alert('Please fill out all fields.');
      return;
    }
    const newEntry = {
      id: uid(),
      date,
      asset,
      action,
      cost: parseFloat(cost),
      createdAt: new Date().toISOString()
    };
    await onSaveEntries([newEntry]);
    setDate('');
    setCost('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Equipment & Maintenance</h1>
      <p className="page-sub">Log diesel usage and machinery repairs.</p>

      <div className="review-block" style={{ marginBottom: '36px' }}>
        <h3>Log Maintenance</h3>
        <div style={{ marginTop: '16px' }}>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          <select className="form-select" value={asset} onChange={e => setAsset(e.target.value)}>
            <option>Generator (100kVA)</option>
            <option>Expeller 1</option>
            <option>Expeller 2</option>
            <option>Crusher</option>
            <option>Filter Press</option>
            <option>Other</option>
          </select>
          <select className="form-select" value={action} onChange={e => setAction(e.target.value)}>
            <option>Diesel Refill</option>
            <option>Worm Replacement</option>
            <option>Cone Replacement</option>
            <option>General Servicing</option>
            <option>Other</option>
          </select>
          <input type="number" className="form-input" placeholder="Cost (₦)" value={cost} onChange={e => setCost(e.target.value)} />
          
          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>Save Log</button>
        </div>
      </div>

      <div className="log-section-title">Maintenance History</div>
      <div className="log-list">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <LogCard 
              key={entry.id}
              title={entry.asset}
              subtitle={entry.date}
              mainValue={formatNaira(entry.cost)}
              subValue={entry.action}
              tag="Equipment"
              type="out"
            />
          ))
        ) : (
          <div className="empty-state">No equipment logs yet.</div>
        )}
      </div>
    </section>
  );
}
