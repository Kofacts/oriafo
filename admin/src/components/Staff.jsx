import React, { useState } from 'react';
import LogCard from './LogCard';
import { uid } from '../lib/api';
import { formatNaira } from '../lib/utils';

export default function Staff({ entries, onSaveEntries }) {
  const [date, setDate] = useState('');
  const [worker, setWorker] = useState('');
  const [role, setRole] = useState('Loader');
  const [shift, setShift] = useState('Day');
  const [wage, setWage] = useState('');

  const handleSave = async () => {
    if (!date || !worker || !wage) {
      alert('Please fill out Date, Worker Name, and Daily Wage.');
      return;
    }
    const newEntry = {
      id: uid(),
      date,
      worker,
      role,
      shift,
      wage: parseFloat(wage),
      createdAt: new Date().toISOString()
    };
    await onSaveEntries([newEntry]);
    setDate('');
    setWorker('');
    setWage('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Staff & Attendance</h1>
      <p className="page-sub">Log daily wages for laborers and operators.</p>

      <div className="review-block" style={{ marginBottom: '36px' }}>
        <h3>Log Daily Wage</h3>
        <div style={{ marginTop: '16px' }}>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          <input type="text" className="form-input" placeholder="Worker Name" value={worker} onChange={e => setWorker(e.target.value)} />
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option>Loader</option>
            <option>Machine Operator</option>
            <option>Security</option>
            <option>Other</option>
          </select>
          <select className="form-select" value={shift} onChange={e => setShift(e.target.value)}>
            <option>Day</option>
            <option>Night</option>
          </select>
          <input type="number" className="form-input" placeholder="Daily Wage (₦)" value={wage} onChange={e => setWage(e.target.value)} />
          
          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>Save Log</button>
        </div>
      </div>

      <div className="log-section-title">Attendance History</div>
      <div className="log-list">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <LogCard 
              key={entry.id}
              title={entry.worker}
              subtitle={entry.date}
              mainValue={formatNaira(entry.wage)}
              subValue={`${entry.role} | ${entry.shift} Shift`}
              tag="Staff"
              type="out"
            />
          ))
        ) : (
          <div className="empty-state">No staff logs yet.</div>
        )}
      </div>
    </section>
  );
}
