import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="brand-text">Quiz<span className="brand-accent">Builder</span></span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                  >
                    Analytics & Tracker
                  </Link>
                  <Link
                    to="/admin/questions"
                    className={`nav-link ${location.pathname === '/admin/questions' ? 'active' : ''}`}
                  >
                    Question Bank & Domains
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    Assessments
                  </Link>
                </>
              )}

              <div className="nav-user-menu">
                <div className="user-badge-container">
                  <span className="user-name">{user?.name}</span>
                  <span className={`role-pill ${isAdmin ? 'admin-pill' : 'candidate-pill'}`}>
                    {isAdmin ? 'Admin' : 'Candidate'}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth-actions">
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
