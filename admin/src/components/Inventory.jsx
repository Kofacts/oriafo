import React from 'react';

export default function Inventory({ procurement, production, processing }) {
  const pknProcured = procurement.reduce((sum, e) => sum + (e.weight || 0), 0);
  const pknClient = processing.reduce((sum, e) => sum + (e.pknReceived || 0), 0);
  const pknCrushed = production.reduce((sum, e) => sum + (e.pknCrushed || 0), 0);
  
  const pknStock = pknProcured + pknClient - pknCrushed;

  const pkoProduced = production.reduce((sum, e) => sum + (e.pkoProduced || 0), 0);
  const pkoDelivered = processing.reduce((sum, e) => sum + (e.pkoDelivered || 0), 0);
  const pkoStock = pkoProduced - pkoDelivered;

  const pkcProduced = production.reduce((sum, e) => sum + (e.pkcProduced || 0), 0);
  const pkcDelivered = processing.reduce((sum, e) => sum + (e.pkcDelivered || 0), 0);
  const pkcStock = pkcProduced - pkcDelivered;

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Inventory</h1>
      <p className="page-sub">Real-time stock levels of raw materials and finished goods.</p>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">PKN (Nuts) Stock</div>
          <div className="stat-value given">
            {pknStock.toFixed(2)} T
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PKO (Oil) Stock</div>
          <div className="stat-value given">
            {pkoStock.toFixed(2)} T
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PKC (Cake) Stock</div>
          <div className="stat-value given">
            {pkcStock.toFixed(2)} T
          </div>
        </div>
      </div>
      
      <div className="review-block">
        <h3>Inventory breakdown</h3>
        <p className="hint">PKN Stock = Procurement + Client Deposits - Production Crushed</p>
        <p className="hint">PKO/PKC Stock = Production Yield - Client Deliveries</p>
      </div>
    </section>
  );
}
