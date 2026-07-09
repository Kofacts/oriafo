import React, { useState } from 'react';
import LogCard from './LogCard';
import { uid } from '../lib/api';
import { formatNaira } from '../lib/utils';

export default function Procurement({ entries, onSaveEntries }) {
  const [date, setDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = async () => {
    if (!date || !supplier || !weight || !price) {
      alert('Please fill out all required fields.');
      return;
    }
    const totalCost = parseFloat(weight) * parseFloat(price);
    const newEntry = {
      id: uid(),
      date,
      supplier,
      vehicle,
      weight: parseFloat(weight),
      price: parseFloat(price),
      totalCost,
      createdAt: new Date().toISOString()
    };
    await onSaveEntries([newEntry]);
    setDate('');
    setSupplier('');
    setVehicle('');
    setWeight('');
    setPrice('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Procurement & Suppliers</h1>
      <p className="page-sub">Log raw material (PKN) purchases.</p>

      <div className="review-block" style={{ marginBottom: '36px' }}>
        <h3>Log PKN Delivery</h3>
        <div style={{ marginTop: '16px' }}>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          <input type="text" className="form-input" placeholder="Supplier Name" value={supplier} onChange={e => setSupplier(e.target.value)} />
          <input type="text" className="form-input" placeholder="Vehicle Plate (Optional)" value={vehicle} onChange={e => setVehicle(e.target.value)} />
          <input type="number" className="form-input" placeholder="Net Weight Delivered (Tons)" value={weight} onChange={e => setWeight(e.target.value)} />
          <input type="number" className="form-input" placeholder="Price per Ton (₦)" value={price} onChange={e => setPrice(e.target.value)} />
          
          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>Save Log</button>
        </div>
      </div>

      <div className="log-section-title">Delivery History</div>
      <div className="log-list">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <LogCard 
              key={entry.id}
              title={entry.supplier}
              subtitle={entry.date}
              mainValue={formatNaira(entry.totalCost)}
              subValue={`${entry.weight}T @ ${formatNaira(entry.price)}/T ${entry.vehicle ? `| Veh: ${entry.vehicle}` : ''}`}
              tag="Procurement"
              type="out"
            />
          ))
        ) : (
          <div className="empty-state">No procurement logs yet.</div>
        )}
      </div>
    </section>
  );
}
