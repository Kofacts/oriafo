import React from 'react';

export default function ReviewTable({ pending, onUpdateField, onAddRow, onDeleteRow, onConfirm, onCancel }) {
  if (!pending.items || pending.items.length === 0) return null;

  const label = pending.type === 'in' ? 'money in' : 'money out';

  return (
    <div id="review-area-finance">
      <div className="review-block">
        <h3>Review {label}</h3>
        <p className="hint">
          Edit anything that was misread, remove rows that don't belong, or add a missing one. Nothing is saved until you confirm.
        </p>
        <div id="review-rows">
          {pending.items.map((item) => (
            <div className="review-row" key={item.id}>
              <input 
                type="text" 
                className="date-input" 
                placeholder="Date" 
                value={item.date} 
                onChange={(e) => onUpdateField(item.id, 'date', e.target.value)} 
              />
              <input 
                type="text" 
                className="desc-input" 
                placeholder="Description" 
                value={item.description} 
                onChange={(e) => onUpdateField(item.id, 'description', e.target.value)} 
              />
              <input 
                type="text" 
                className="amount amount-input" 
                placeholder="Amount" 
                value={item.amount} 
                onChange={(e) => onUpdateField(item.id, 'amount', e.target.value)} 
              />
              <button className="row-delete" title="Remove row" onClick={() => onDeleteRow(item.id)}>
                &times;
              </button>
            </div>
          ))}
        </div>
        <button className="add-row-btn" onClick={onAddRow}>+ Add a line</button>
        <div className="review-actions">
          <button className="btn btn-primary" onClick={onConfirm}>Confirm and save</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
