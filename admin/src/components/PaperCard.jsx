import React, { useState } from 'react';
import { formatNaira, formatDate } from '../lib/utils';

export default function PaperCard({ entry, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(entry.date || '');
  const [editDesc, setEditDesc] = useState(entry.description || '');
  const [editAmount, setEditAmount] = useState(entry.amount || '');

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...entry, date: editDate, description: editDesc, amount: parseFloat(editAmount) || 0 });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (onDelete) onDelete(entry.id);
    }
  };

  if (isEditing) {
    return (
      <div className="paper-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="date" className="form-input" value={editDate} onChange={e => setEditDate(e.target.value)} style={{ marginBottom: 0 }} />
          <input type="text" className="form-input" value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ marginBottom: 0 }} />
          <input type="number" className="form-input" value={editAmount} onChange={e => setEditAmount(e.target.value)} style={{ marginBottom: 0 }} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  const dateStr = formatDate(entry.date);
  
  return (
    <div className="paper-card">
      <div className="paper-card-top">
        <div>
          <div className="paper-desc">{entry.description}</div>
          <div className="paper-date">{dateStr}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={`paper-amount ${entry.type}`}>
            {entry.type === 'in' ? '+' : '-'}{formatNaira(entry.amount)}
          </div>
          {onUpdate && onDelete && (
            <div style={{ marginTop: '6px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="row-delete" style={{ fontSize: '12px', padding: '2px 4px', color: 'var(--text-muted)' }} onClick={() => setIsEditing(true)}>Edit</button>
              <button className="row-delete" style={{ fontSize: '12px', padding: '2px 4px', color: 'var(--spent)' }} onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <span className={`paper-tag ${entry.type}`}>
        {entry.type === 'in' ? 'Money in' : 'Money out'}
      </span>
    </div>
  );
}
