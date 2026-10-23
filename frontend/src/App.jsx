import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { QuizRoom } from './pages/QuizRoom';
import { ResultReview } from './pages/ResultReview';
import { AdminDashboard } from './pages/AdminDashboard';
import { QuestionManager } from './pages/QuestionManager';
import { ProtectedRoute } from './routes/ProtectedRoute';

export const App = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/admin/login" element={<AuthPage initialMode="login" />} />

          {/* Candidate Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:categoryId"
            element={
              <ProtectedRoute>
                <QuizRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:attemptId"
            element={
              <ProtectedRoute>
                <ResultReview />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <QuestionManager />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};
