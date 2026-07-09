import React, { useState } from 'react';
import LogCard from './LogCard';
import { uid } from '../lib/api';

export default function Production({ entries, onSaveEntries }) {
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('Day');
  const [pknCrushed, setPknCrushed] = useState('');
  const [pkoProduced, setPkoProduced] = useState('');
  const [pkcProduced, setPkcProduced] = useState('');
  const [operator, setOperator] = useState('');

  const handleSave = async () => {
    if (!date || !pknCrushed || !pkoProduced || !pkcProduced) {
      alert('Please fill out all required fields.');
      return;
    }
    const newEntry = {
      id: uid(),
      date,
      shift,
      pknCrushed: parseFloat(pknCrushed),
      pkoProduced: parseFloat(pkoProduced),
      pkcProduced: parseFloat(pkcProduced),
      operator,
      createdAt: new Date().toISOString()
    };
    await onSaveEntries([newEntry]);
    setDate('');
    setPknCrushed('');
    setPkoProduced('');
    setPkcProduced('');
    setOperator('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Production</h1>
      <p className="page-sub">Log daily milling operations.</p>

      <div className="review-block" style={{ marginBottom: '36px' }}>
        <h3>Log Production Run</h3>
        <div style={{ marginTop: '16px' }}>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          <select className="form-select" value={shift} onChange={e => setShift(e.target.value)}>
            <option>Day</option>
            <option>Night</option>
          </select>
          <input type="number" className="form-input" placeholder="PKN Crushed (Tons)" value={pknCrushed} onChange={e => setPknCrushed(e.target.value)} />
          <input type="number" className="form-input" placeholder="PKO Produced (Tons)" value={pkoProduced} onChange={e => setPkoProduced(e.target.value)} />
          <input type="number" className="form-input" placeholder="PKC Produced (Tons)" value={pkcProduced} onChange={e => setPkcProduced(e.target.value)} />
          <input type="text" className="form-input" placeholder="Operator Name (Optional)" value={operator} onChange={e => setOperator(e.target.value)} />
          
          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>Save Log</button>
        </div>
      </div>

      <div className="log-section-title">Production History</div>
      <div className="log-list">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <LogCard 
              key={entry.id}
              title={`Shift: ${entry.shift} ${entry.operator ? '| Operator: ' + entry.operator : ''}`}
              subtitle={entry.date}
              mainValue={`${entry.pknCrushed}T PKN`}
              subValue={`Yield: ${entry.pkoProduced}T PKO, ${entry.pkcProduced}T PKC`}
              tag="Production"
              type="neutral"
            />
          ))
        ) : (
          <div className="empty-state">No production logs yet.</div>
        )}
      </div>
    </section>
  );
}
