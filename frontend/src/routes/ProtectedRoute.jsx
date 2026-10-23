import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Quiz Builder...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Candidates accessing admin routes get redirected to candidate dashboard
    if (requiredRole === 'ROLE_ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
    // Admin accessing candidate-only route can be allowed or redirected
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
