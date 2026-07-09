import React, { useState } from 'react';
import LogCard from './LogCard';
import { uid } from '../lib/api';
import { formatNaira } from '../lib/utils';

export default function Processing({ entries, onSaveEntries }) {
  const [date, setDate] = useState('');
  const [client, setClient] = useState('');
  const [pknReceived, setPknReceived] = useState('');
  const [pkoDelivered, setPkoDelivered] = useState('');
  const [pkcDelivered, setPkcDelivered] = useState('');
  const [fee, setFee] = useState('');

  const handleSave = async () => {
    if (!date || !client || !pknReceived || !fee) {
      alert('Please fill out at least Date, Client, PKN Received, and Milling Fee.');
      return;
    }
    const newEntry = {
      id: uid(),
      date,
      client,
      pknReceived: parseFloat(pknReceived),
      pkoDelivered: parseFloat(pkoDelivered) || 0,
      pkcDelivered: parseFloat(pkcDelivered) || 0,
      fee: parseFloat(fee),
      createdAt: new Date().toISOString()
    };
    await onSaveEntries([newEntry]);
    setDate('');
    setClient('');
    setPknReceived('');
    setPkoDelivered('');
    setPkcDelivered('');
    setFee('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Processing Services</h1>
      <p className="page-sub">Log milling services performed for clients.</p>

      <div className="review-block" style={{ marginBottom: '36px' }}>
        <h3>Log Processing Job</h3>
        <div style={{ marginTop: '16px' }}>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          <input type="text" className="form-input" placeholder="Client Name" value={client} onChange={e => setClient(e.target.value)} />
          <input type="number" className="form-input" placeholder="PKN Received (Tons)" value={pknReceived} onChange={e => setPknReceived(e.target.value)} />
          <input type="number" className="form-input" placeholder="PKO Delivered (Tons, Optional)" value={pkoDelivered} onChange={e => setPkoDelivered(e.target.value)} />
          <input type="number" className="form-input" placeholder="PKC Delivered (Tons, Optional)" value={pkcDelivered} onChange={e => setPkcDelivered(e.target.value)} />
          <input type="number" className="form-input" placeholder="Milling Fee Charged (₦)" value={fee} onChange={e => setFee(e.target.value)} />
          
          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>Save Log</button>
        </div>
      </div>

      <div className="log-section-title">Service History</div>
      <div className="log-list">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <LogCard 
              key={entry.id}
              title={`Client: ${entry.client}`}
              subtitle={entry.date}
              mainValue={formatNaira(entry.fee)}
              subValue={`Received ${entry.pknReceived}T PKN -> Delivered ${entry.pkoDelivered}T PKO, ${entry.pkcDelivered}T PKC`}
              tag="Processing"
              type="in"
            />
          ))
        ) : (
          <div className="empty-state">No processing logs yet.</div>
        )}
      </div>
    </section>
  );
}
