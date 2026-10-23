import React, { useState, useEffect } from 'react';
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
      setError('Failed to load assessment data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (categoryId) => {
    try {
      setStartingQuizId(categoryId);
      setError('');
      // Calling start API creates attempt and validates quota
      const res = await attemptApi.start(categoryId);
      navigate(`/quiz/${categoryId}`, { state: { quizData: res.data } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to launch quiz. Attempt limit may be reached.';
      setError(msg);
      fetchDashboardData(); // Refresh cards to show updated lock state
    } finally {
      setStartingQuizId(null);
    }
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <section className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Candidate Assessment Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome, <span className="highlight-text">{user?.name}</span>. Test your domain knowledge.
              Each category permits exactly <strong className="quota-tag">2 attempts</strong> (Attempt 1: Baseline, Attempt 2: Final Retake).
            </p>
          </div>

          <div className="candidate-stats-strip">
            <div className="stat-pill">
              <span className="stat-value">{categories.filter(c => c.attemptsUsed > 0).length}/{categories.length}</span>
              <span className="stat-label">Domains Started</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value">{history.filter(h => h.status === 'COMPLETED').length}</span>
              <span className="stat-label">Evaluations Done</span>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger dismissible-alert">
            <span>{error}</span>
            <button onClick={() => setError('')} className="alert-close">&times;</button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading assessment domains...</p>
          </div>
        ) : (
          <>
            {/* Domain Cards Section */}
            <section className="domains-section">
              <div className="section-title-bar">
                <h2>Evaluation Domains</h2>
                <span className="text-muted">Select an active domain to begin your evaluation</span>
              </div>

              <div className="domains-grid">
                {categories.map((cat) => {
                  const isLocked = cat.attemptsUsed >= cat.maxAttempts;
                  const isRetake = cat.attemptsUsed === 1;
                  const isFresh = cat.attemptsUsed === 0;

                  return (
                    <div key={cat.id} className={`domain-card ${isLocked ? 'card-locked' : ''}`}>
                      <div className="card-top">
                        <div className="card-badges">
                          <span className={`badge ${getDifficultyClass(cat.difficulty)}`}>
                            {cat.difficulty}
                          </span>
                          <span className="timer-badge">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {cat.timerMinutes} mins
                          </span>
                        </div>

                        <div className={`attempts-quota-badge ${isLocked ? 'quota-full' : isRetake ? 'quota-warning' : 'quota-open'}`}>
                          Attempts: {cat.attemptsUsed}/{cat.maxAttempts}
                        </div>
                      </div>

                      <h3 className="domain-card-title">{cat.title}</h3>
                      <p className="domain-card-desc">{cat.description || 'Comprehensive assessment for core competency.'}</p>

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
                            Best Score: <strong>{cat.highestScore}/{cat.questionCount}</strong>
                          </span>
                        )}
                      </div>

                      {/* Score History summary if taken */}
                      {(cat.baselineScore !== null || cat.retakeScore !== null) && (
                        <div className="domain-score-history">
                          {cat.baselineScore !== null && (
                            <div className="score-pill baseline">
                              <span>Baseline: <strong>{cat.baselineScore}/{cat.questionCount}</strong></span>
                            </div>
                          )}
                          {cat.retakeScore !== null && (
                            <div className="score-pill retake">
                              <span>Retake: <strong>{cat.retakeScore}/{cat.questionCount}</strong></span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="card-actions">
                        {isLocked ? (
                          <div className="locked-action-container">
                            <button disabled className="btn btn-locked btn-block">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              Locked (2/2 Used)
                            </button>
                            {cat.lastAttemptId && (
                              <button
                                onClick={() => navigate(`/results/${cat.lastAttemptId}`)}
                                className="btn btn-outline btn-sm btn-block mt-2"
                              >
                                Review Latest Result
                              </button>
                            )}
                          </div>
                        ) : isRetake ? (
                          <button
                            onClick={() => handleStartQuiz(cat.id)}
                            disabled={startingQuizId === cat.id}
                            className="btn btn-warning btn-block"
                          >
                            {startingQuizId === cat.id ? 'Preparing...' : 'Retake Quiz (Final Attempt)'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartQuiz(cat.id)}
                            disabled={startingQuizId === cat.id}
                            className="btn btn-primary btn-block"
                          >
                            {startingQuizId === cat.id ? 'Launching...' : 'Start Quiz (Attempt 1)'}
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
                <h2>Your Evaluation History</h2>
                <span className="text-muted">Review scores, answer audits, and detailed explanations</span>
              </div>

              {history.length === 0 ? (
                <div className="empty-history-box">
                  <p>You haven't completed any assessments yet. Choose a domain above to begin!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Attempt Type</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Completed Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h) => (
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
                                style={{ width: `${Math.min(h.percentage || 0, 100)}%` }}
                              ></div>
                              <span className="percentage-text">{h.percentage}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${h.status === 'COMPLETED' ? 'status-completed' : 'status-timedout'}`}>
                              {h.status === 'COMPLETED' ? 'Completed' : 'Timed Out'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {h.submittedAt
                              ? new Date(h.submittedAt).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>
                          <td>
                            <button
                              onClick={() => navigate(`/results/${h.attemptId}`)}
                              className="btn btn-secondary btn-sm"
                            >
                              Review Answers
                            </button>
                          </td>
                        </tr>
                      ))}
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
