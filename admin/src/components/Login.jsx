import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '24px' }}>
      <div className="login-box" style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: '"Spectral", serif', fontSize: '32px', color: 'var(--accent)', fontWeight: '600' }}>ORIAFO</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Admin Dashboard</div>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <div style={{ color: 'var(--spent)', fontSize: '13px', background: 'rgba(235, 87, 87, 0.1)', padding: '10px', borderRadius: '6px' }}>{error}</div>}
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="operator@oriafo.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 0 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 0 }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
