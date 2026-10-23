import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi, attemptApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingQuizId, setStartingQuizId] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'RETAKE' | 'COMPLETED'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [catRes, histRes] = await Promise.all([
        categoryApi.getCandidateSummaries(),
        attemptApi.getMyHistory(),
      ]);
      setCategories(catRes.data);
      setHistory(histRes.data);
    } catch (err) {
      setError('Failed to load assessment data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (categoryId) => {
    try {
      setStartingQuizId(categoryId);
      setError('');
      const res = await attemptApi.start(categoryId);
      navigate(`/quiz/${categoryId}`, { state: { quizData: res.data } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to launch quiz. Attempt limit may be reached.';
      setError(msg);
      fetchDashboardData();
    } finally {
      setStartingQuizId(null);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDifficultyClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'badge-easy';
      case 'hard':
        return 'badge-hard';
      default:
        return 'badge-medium';
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const isLocked = cat.attemptsUsed >= cat.maxAttempts;
      const isRetake = cat.attemptsUsed === 1;
      const isFresh = cat.attemptsUsed === 0;

      if (filter === 'AVAILABLE') return isFresh || isRetake;
      if (filter === 'RETAKE') return isRetake;
      if (filter === 'COMPLETED') return isLocked;
      return true;
    });
  }, [categories, filter]);

  // Overall candidate stats
  const totalCompletedEvaluations = history.filter(h => h.status === 'COMPLETED').length;
  const averageScorePct = history.length > 0
    ? Math.round((history.reduce((acc, h) => acc + (h.score / h.total) * 100, 0)) / history.length)
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Humanized Welcome Hero Banner */}
        <section className="dashboard-hero-banner">
          <div className="hero-content">
            <div className="hero-greeting-row">
              <div className="hero-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span className="greeting-pill">{getGreeting()}</span>
                <h1 className="dashboard-title">
                  Welcome back, <span className="highlight-name">{user?.name}</span> 👋
                </h1>
                <p className="dashboard-subtitle">
                  Every quiz is designed to help you grow. Each topic provides exactly <strong>2 attempts</strong>:
                  an initial <em>Baseline assessment</em> followed by an opportunity for a <em>Final Retake</em> to beat your score!
                </p>
              </div>
            </div>
          </div>

          <div className="candidate-stats-strip">
            <div className="stat-pill">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <span className="stat-value">{categories.filter(c => c.attemptsUsed > 0).length}/{categories.length}</span>
                <span className="stat-label">Topics Explored</span>
              </div>
            </div>
            <div className="stat-pill">
              <span className="stat-icon">🎯</span>
              <div className="stat-info">
                <span className="stat-value">{totalCompletedEvaluations}</span>
                <span className="stat-label">Tests Completed</span>
              </div>
            </div>
            {history.length > 0 && (
              <div className="stat-pill">
                <span className="stat-icon">⭐</span>
                <div className="stat-info">
                  <span className="stat-value">{averageScorePct}%</span>
                  <span className="stat-label">Average Score</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="alert alert-danger dismissible-alert">
            <div className="alert-content">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="alert-close">&times;</button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Preparing your learning journey...</p>
          </div>
        ) : (
          <>
            {/* Domain Cards Section with Humanized Filter Pills */}
            <section className="domains-section">
              <div className="section-header-bar">
                <div>
                  <h2 className="section-heading">Assessment Topics</h2>
                  <span className="section-subtext">Choose a domain to start a new quiz or review your previous attempts</span>
                </div>

                <div className="filter-chips">
                  <button
                    onClick={() => setFilter('ALL')}
                    className={`filter-chip ${filter === 'ALL' ? 'active' : ''}`}
                  >
                    All Topics ({categories.length})
                  </button>
                  <button
                    onClick={() => setFilter('AVAILABLE')}
                    className={`filter-chip ${filter === 'AVAILABLE' ? 'active' : ''}`}
                  >
                    Ready to Take ({categories.filter(c => c.attemptsUsed < c.maxAttempts).length})
                  </button>
                  <button
                    onClick={() => setFilter('RETAKE')}
                    className={`filter-chip ${filter === 'RETAKE' ? 'active' : ''}`}
                  >
                    ⚡ Retakes Open ({categories.filter(c => c.attemptsUsed === 1).length})
                  </button>
                  <button
                    onClick={() => setFilter('COMPLETED')}
                    className={`filter-chip ${filter === 'COMPLETED' ? 'active' : ''}`}
                  >
                    🔒 Completed ({categories.filter(c => c.attemptsUsed >= c.maxAttempts).length})
                  </button>
                </div>
              </div>

              <div className="domains-grid">
                {filteredCategories.map((cat) => {
                  const isLocked = cat.attemptsUsed >= cat.maxAttempts;
                  const isRetake = cat.attemptsUsed === 1;
                  const isFresh = cat.attemptsUsed === 0;

                  return (
                    <div
                      key={cat.id}
                      className={`domain-card ${isLocked ? 'card-locked' : isRetake ? 'card-retake' : 'card-fresh'}`}
                    >
                      <div className="card-top">
                        <div className="card-badges">
                          <span className={`badge ${getDifficultyClass(cat.difficulty)}`}>
                            {cat.difficulty}
                          </span>
                          <span className="timer-badge">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {cat.timerMinutes} mins
                          </span>
                        </div>

                        <div className={`attempts-quota-badge ${isLocked ? 'quota-full' : isRetake ? 'quota-warning' : 'quota-open'}`}>
                          {isLocked ? '🔒 2/2 Used' : isRetake ? '⚡ 1 Attempt Left' : '✨ 2 Attempts Left'}
                        </div>
                      </div>

                      <h3 className="domain-card-title">{cat.title}</h3>
                      <p className="domain-card-desc">{cat.description || 'Comprehensive assessment for core competency.'}</p>

                      {/* Visual 2-Step Attempt Tracker */}
                      <div className="attempt-tracker-row">
                        <div className={`tracker-step ${cat.baselineScore !== null ? 'done' : 'pending'}`}>
                          <div className="step-circle">1</div>
                          <div className="step-text">
                            <span className="step-label">Baseline</span>
                            <span className="step-val">
                              {cat.baselineScore !== null ? `${cat.baselineScore}/${cat.questionCount}` : 'Not taken'}
                            </span>
                          </div>
                        </div>
                        <div className="tracker-divider"></div>
                        <div className={`tracker-step ${cat.retakeScore !== null ? 'done' : isRetake ? 'ready' : 'pending'}`}>
                          <div className="step-circle">2</div>
                          <div className="step-text">
                            <span className="step-label">Retake</span>
                            <span className="step-val">
                              {cat.retakeScore !== null
                                ? `${cat.retakeScore}/${cat.questionCount}`
                                : isRetake
                                ? 'Available now'
                                : 'Unlocked after #1'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="domain-meta">
                        <span className="meta-item">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          {cat.questionCount} Questions
                        </span>
                        {cat.highestScore !== null && (
                          <span className="meta-score">
                            Personal Best: <strong>{cat.highestScore}/{cat.questionCount}</strong>
                          </span>
                        )}
                      </div>

                      <div className="card-actions">
                        {isLocked ? (
                          <div className="locked-action-container">
                            <button disabled className="btn btn-locked btn-block">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              Both Attempts Completed
                            </button>
                            {cat.lastAttemptId && (
                              <button
                                onClick={() => navigate(`/results/${cat.lastAttemptId}`)}
                                className="btn btn-outline btn-sm btn-block mt-2"
                              >
                                Review Your Score & Explanations &rarr;
                              </button>
                            )}
                          </div>
                        ) : isRetake ? (
                          <button
                            onClick={() => handleStartQuiz(cat.id)}
                            disabled={startingQuizId === cat.id}
                            className="btn btn-warning btn-block"
                          >
                            {startingQuizId === cat.id ? 'Starting Exam...' : '⚡ Take Final Retake (Attempt 2)'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartQuiz(cat.id)}
                            disabled={startingQuizId === cat.id}
                            className="btn btn-primary btn-block"
                          >
                            {startingQuizId === cat.id ? 'Starting Exam...' : '🚀 Start Baseline Quiz (Attempt 1)'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Attempt History Section */}
            <section className="history-section">
              <div className="section-title-bar">
                <h2>Your Learning History</h2>
                <span className="text-muted">Review scores, detailed answer audits, and key takeaways</span>
              </div>

              {history.length === 0 ? (
                <div className="empty-history-box">
                  <div className="empty-icon">🌱</div>
                  <h3>No Assessments Completed Yet</h3>
                  <p>Pick any domain above to begin your baseline evaluation. You'll receive instant feedback and explanations!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Attempt</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Date Completed</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h) => {
                        const pct = Math.round((h.score / h.total) * 100);
                        return (
                          <tr key={h.attemptId}>
                            <td className="table-domain-name">
                              <strong>{h.categoryTitle}</strong>
                              <span className={`table-diff-tag ${getDifficultyClass(h.difficulty)}`}>{h.difficulty}</span>
                            </td>
                            <td>
                              <span className={`attempt-type-badge ${h.attemptNumber === 1 ? 'type-baseline' : 'type-retake'}`}>
                                {h.attemptNumber === 1 ? 'Attempt 1 (Baseline)' : 'Attempt 2 (Retake)'}
                              </span>
                            </td>
                            <td>
                              <span className="score-text">
                                <strong>{h.score}</strong> / {h.total}
                              </span>
                            </td>
                            <td>
                              <div className="percentage-bar-container">
                                <div
                                  className="percentage-bar-fill"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444',
                                  }}
                                ></div>
                              </div>
                              <span className="percentage-text">{pct}%</span>
                            </td>
                            <td>
                              <span className={`status-badge ${h.status === 'COMPLETED' ? 'status-ok' : 'status-expired'}`}>
                                {h.status === 'COMPLETED' ? 'Completed' : 'Timed Out'}
                              </span>
                            </td>
                            <td className="date-cell">
                              {h.completedAt ? new Date(h.completedAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : '—'}
                            </td>
                            <td>
                              <button
                                onClick={() => navigate(`/results/${h.attemptId}`)}
                                className="btn btn-outline btn-sm"
                              >
                                View Review &rarr;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};
