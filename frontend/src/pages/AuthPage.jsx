import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isSessionExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const user = await register(name, email, password);
        if (user.role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        const user = await login(email, password);
        if (user.role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillCandidateCredentials = () => {
    setEmail('user@omnix.com');
    setPassword('user123');
    setIsRegister(false);
    setError('');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@omnix.com');
    setPassword('admin123');
    setIsRegister(false);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2>{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Join Quiz Builder to test and track your domain mastery'
              : 'Sign in to access your quizzes and evaluations'}
          </p>
        </div>

        {isSessionExpired && (
          <div className="alert alert-warning">
            Your session has expired. Please sign in again.
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="candidate@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Processing...' : isRegister ? 'Register Candidate Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="btn-text"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need a candidate account?{' '}
              <button
                type="button"
                className="btn-text"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
              >
                Register Here
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Fill Box */}
        <div className="auth-quick-fill">
          <span className="quick-fill-label">Quick-Fill Credentials:</span>
          <div className="quick-fill-buttons">
            <button type="button" onClick={fillCandidateCredentials} className="btn-chip candidate-chip">
              Candidate (user@omnix.com)
            </button>
            <button type="button" onClick={fillAdminCredentials} className="btn-chip admin-chip">
              Admin (admin@omnix.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
