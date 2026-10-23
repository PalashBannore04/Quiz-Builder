import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickCandidateLogin = async () => {
    try {
      await login('user@quizbuilder.com', 'user123');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdminLogin = async () => {
    try {
      await login('admin@quizbuilder.com', 'admin123');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge-pulse"></span>
          Intelligent & Empathetic Assessment Platform
        </div>
        <h1 className="hero-title">
          Master Your Skills With <span className="text-gradient">Confidence & Clarity</span>
        </h1>
        <p className="hero-subtitle">
          Practice without test anxiety. Enjoy timed evaluations, an encouraging 2-attempt growth system, instant rationales, and real-time score improvement tracking.
        </p>

        <div className="hero-cta-group">
          {isAuthenticated ? (
            <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="btn btn-primary btn-lg">
              Go to Your Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                Candidate Login
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Demo Fast-Login Strip */}
        <div className="demo-credentials-card">
          <div className="demo-header">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>One-Click Test Accounts:</span>
          </div>
          <div className="demo-buttons">
            <button onClick={handleQuickCandidateLogin} className="btn-demo candidate">
              <strong>Candidate Demo</strong>
              <small>user@quizbuilder.com | user123</small>
            </button>
            <button onClick={handleQuickAdminLogin} className="btn-demo admin">
              <strong>Administrator Demo</strong>
              <small>admin@quizbuilder.com | admin123</small>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon bg-indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Server-Enforced Timers</h3>
            <p>
              Synchronized client & server timers auto-submit assessments when time expires to guarantee examination integrity.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>Strict 2-Attempt Policy</h3>
            <p>
              Attempt 1 establishes candidate baseline; Attempt 2 serves as the final retake. Subsequent attempts are blocked.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10"></path>
                <path d="M12 20V4"></path>
                <path d="M6 20v-6"></path>
              </svg>
            </div>
            <h3>Delta Performance Tracking</h3>
            <p>
              Admins track candidate progression across attempts with real-time score delta calculations and comprehensive audits.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3>In-Depth Answer Reviews</h3>
            <p>
              Immediate post-submission review provides color-coded option comparisons alongside comprehensive conceptual explanations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
