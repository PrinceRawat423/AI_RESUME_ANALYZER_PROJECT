import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuthToken('');
    navigate('/login');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(2, 6, 23, 0.92)', backdropFilter: 'blur(12px)' }}>
      <div style={{ margin: '0 auto', maxWidth: 1280, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <Link to="/dashboard" style={{ fontSize: 18, fontWeight: 700, color: '#67e8f9' }}>
          AI Resume Analyzer
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          {isLoggedIn ? (
            <>
              <span style={{ color: '#cbd5e1' }}>Hi, {user?.name || 'User'}</span>
              <Link style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '8px 16px' }} to="/dashboard">
                Dashboard
              </Link>
              <Link style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '8px 16px' }} to="/upload">
                Upload
              </Link>
              <Link style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '8px 16px' }} to="/coach">
                Coach
              </Link>
              <button
                onClick={handleLogout}
                style={{ borderRadius: 999, background: '#22d3ee', color: '#020617', padding: '8px 16px', fontWeight: 600, border: 'none' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '8px 16px' }} to="/login">
                Login
              </Link>
              <Link style={{ borderRadius: 999, background: '#22d3ee', color: '#020617', padding: '8px 16px', fontWeight: 600 }} to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
