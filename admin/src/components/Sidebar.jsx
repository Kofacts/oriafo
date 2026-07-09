import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="brand">
        <img src="/oriafo/2 (2).png" alt="Oriafo Logo" className="brand-image" />
      </div>
      
      <div className="nav-group-label">Dashboard</div>
      <NavLink to="/overview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Overview
      </NavLink>
      <NavLink to="/finance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Finance
      </NavLink>

      <div className="nav-group-label">Mill Operations</div>
      <NavLink to="/production" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Production
      </NavLink>
      <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Inventory
      </NavLink>
      <NavLink to="/procurement" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Procurement &amp; Suppliers
      </NavLink>
      <NavLink to="/processing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Processing Services
      </NavLink>
      <NavLink to="/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Staff &amp; Attendance
      </NavLink>
      <NavLink to="/equipment" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        Equipment &amp; Maintenance
      </NavLink>
    </nav>
  );
}
