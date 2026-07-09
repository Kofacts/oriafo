import React from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar({ role }) {
  const isSuperAdmin = role === 'super_admin';
  const isManager = role === 'manager' || isSuperAdmin;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="brand">
        <img src="/oriafo/2 (2).png" alt="Oriafo Logo" className="brand-image" />
      </div>
      
      {isSuperAdmin && (
        <>
          <div className="nav-group-label">Dashboard</div>
          <NavLink to="/overview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Overview
          </NavLink>
          <NavLink to="/finance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Finance
          </NavLink>
        </>
      )}

      <div className="nav-group-label">Mill Operations</div>
      <NavLink to="/production" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Production
      </NavLink>
      
      {isManager && (
        <>
          <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Inventory
          </NavLink>
          <NavLink to="/procurement" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Procurement & Suppliers
          </NavLink>
          <NavLink to="/processing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Processing Services
          </NavLink>
          <NavLink to="/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Staff & Attendance
          </NavLink>
        </>
      )}
      
      <NavLink to="/equipment" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Equipment & Maintenance
      </NavLink>

      <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <button className="btn btn-ghost" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)' }}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
