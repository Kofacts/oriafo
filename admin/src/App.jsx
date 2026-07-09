import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Finance from './components/Finance';
import Production from './components/Production';
import Procurement from './components/Procurement';
import Processing from './components/Processing';
import Staff from './components/Staff';
import Equipment from './components/Equipment';
import Inventory from './components/Inventory';
import Login from './components/Login';
import { loadData, saveData, deleteData } from './lib/storage';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [finance, setFinance] = useState([]);
  const [production, setProduction] = useState([]);
  const [procurement, setProcurement] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [staff, setStaff] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (data) setRole(data.role);
    else setRole('worker'); // fallback
    setAuthLoading(false);
  };

  useEffect(() => {
    if (!session) return;
    
    loadData('oriafo_ops_finance').then(setFinance);
    loadData('oriafo_ops_production').then(setProduction);
    loadData('oriafo_ops_procurement').then(setProcurement);
    loadData('oriafo_ops_processing').then(setProcessing);
    loadData('oriafo_ops_staff').then(setStaff);
    loadData('oriafo_ops_equipment').then(setEquipment);
    
    loadData('oriafo_ops_entries').then(oldEntries => {
      if (oldEntries.length > 0) {
        setFinance(prev => prev.length ? prev : oldEntries);
      }
    });
  }, [session]);

  const createSaver = (key, setter) => async (newEntries) => {
    setter(prev => {
      const updated = [...prev, ...newEntries];
      saveData(key, updated);
      if (key === 'oriafo_ops_finance') saveData('oriafo_ops_entries', updated);
      return updated;
    });
  };

  const createUpdater = (key, setter) => async (updatedEntry) => {
    setter(prev => {
      const updated = prev.map(e => e.id === updatedEntry.id ? updatedEntry : e);
      saveData(key, [updatedEntry]);
      if (key === 'oriafo_ops_finance') saveData('oriafo_ops_entries', updated);
      return updated;
    });
  };

  const createDeleter = (key, setter) => async (id) => {
    setter(prev => {
      const updated = prev.filter(e => e.id !== id);
      deleteData(key, id);
      if (key === 'oriafo_ops_finance') saveData('oriafo_ops_entries', updated);
      return updated;
    });
  };

  if (authLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  if (!session) {
    return <Login />;
  }

  const isSuperAdmin = role === 'super_admin';
  const isManager = role === 'manager' || isSuperAdmin;

  return (
    <div className="app">
      <Sidebar role={role} />
      
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to={isManager ? "/overview" : "/production"} replace />} />
          
          {/* Super Admin Only */}
          {isSuperAdmin && (
            <>
              <Route path="/overview" element={<Overview finance={finance} production={production} procurement={procurement} processing={processing} />} />
              <Route path="/finance" element={<Finance entries={finance} onSaveEntries={createSaver('oriafo_ops_finance', setFinance)} onUpdateEntry={createUpdater('oriafo_ops_finance', setFinance)} onDeleteEntry={createDeleter('oriafo_ops_finance', setFinance)} />} />
            </>
          )}

          {/* Manager & Super Admin */}
          {isManager && (
            <>
              <Route path="/overview" element={!isSuperAdmin ? <Navigate to="/production" replace /> : <Overview finance={finance} production={production} procurement={procurement} processing={processing} />} />
              <Route path="/inventory" element={<Inventory procurement={procurement} production={production} processing={processing} />} />
              <Route path="/procurement" element={<Procurement entries={procurement} onSaveEntries={createSaver('oriafo_ops_procurement', setProcurement)} />} />
              <Route path="/processing" element={<Processing entries={processing} onSaveEntries={createSaver('oriafo_ops_processing', setProcessing)} />} />
              <Route path="/staff" element={<Staff entries={staff} onSaveEntries={createSaver('oriafo_ops_staff', setStaff)} />} />
            </>
          )}

          {/* All logged-in users (Workers included) */}
          <Route path="/production" element={<Production entries={production} onSaveEntries={createSaver('oriafo_ops_production', setProduction)} />} />
          <Route path="/equipment" element={<Equipment entries={equipment} onSaveEntries={createSaver('oriafo_ops_equipment', setEquipment)} />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to={isManager ? "/overview" : "/production"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
