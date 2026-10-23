import React from 'react';
import { Leaf, History, Sparkles, User, LogOut, LogIn, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar" id="app-navbar">
      <div className="container nav-inner">
        <div 
          className="brand" 
          id="nav-brand-logo"
          onClick={() => setActivePage('home')}
        >
          <div className="brand-icon">
            <Leaf size={22} />
          </div>
          <div className="brand-text">
            <h1>E-Ayurvedic</h1>
            <div className="brand-tag">Health Assistant</div>
          </div>
        </div>

        <div className="nav-links">
          <button
            id="nav-btn-consultation"
            className={`nav-btn ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            <Sparkles size={18} />
            <span>Consultation</span>
          </button>

          {currentUser && (
            <button
              id="nav-btn-history"
              className={`nav-btn ${activePage === 'history' ? 'active' : ''}`}
              onClick={() => setActivePage('history')}
            >
              <History size={18} />
              <span>My History</span>
            </button>
          )}

          {currentUser ? (
            <div className="user-badge" id="nav-user-profile">
              <User size={16} />
              <span>{currentUser.displayName || currentUser.email}</span>
              <button
                id="btn-nav-logout"
                className="btn-logout"
                title="Sign Out"
                onClick={logout}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-login"
              className="nav-btn active"
              onClick={() => setActivePage('login')}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
