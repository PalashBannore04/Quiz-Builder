import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { attemptApi } from '../api/endpoints';

export const ResultReview = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!location.state?.resultData);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'CORRECT', 'INCORRECT'

  useEffect(() => {
    if (!result && attemptId) {
      const fetchResult = async () => {
        try {
          setLoading(true);
          const res = await attemptApi.getResult(attemptId);
          setResult(res.data);
        } catch (err) {
          setError('Failed to load assessment result. You may not be authorized to view this audit.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [attemptId, result]);

  if (loading) {
    return (
      <div className="review-loading-screen">
        <div className="spinner"></div>
        <p>Loading assessment review...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="review-error-screen">
        <div className="error-card">
          <h3>Unable to Load Review</h3>
          <p>{error || 'Assessment not found.'}</p>
          <Link to="/dashboard" className="btn btn-primary mt-3">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const correctAnswersCount = result.answers.filter((a) => a.isCorrect).length;
  const incorrectAnswersCount = result.answers.filter((a) => !a.isCorrect && a.selectedOption).length;
  const unansweredCount = result.answers.filter((a) => !a.selectedOption).length;

  const filteredAnswers = result.answers.filter((ans) => {
    if (filter === 'CORRECT') return ans.isCorrect;
    if (filter === 'INCORRECT') return !ans.isCorrect;
    return true;
  });

  const getPercentageColor = (pct) => {
    if (pct >= 80) return 'text-success';
    if (pct >= 50) return 'text-warning';
    return 'text-danger';
  };

  const getFeedbackMessage = (pct) => {
    if (pct === 100) return { emoji: '🏆', title: 'Flawless Mastery!', desc: 'You answered every single question correctly. Outstanding conceptual command!' };
    if (pct >= 80) return { emoji: '🌟', title: 'Excellent Performance!', desc: 'Solid grasp of this domain. Just a slight review away from perfection.' };
    if (pct >= 60) return { emoji: '👏', title: 'Great Effort!', desc: 'Strong foundation! Review the detailed rationales below to sharpen your edge.' };
    return { emoji: '💪', title: 'Valuable Learning Experience!', desc: 'Every attempt builds knowledge. Review each explanation below to ace your next retake!' };
  };

  const feedback = getFeedbackMessage(result.percentage);

  return (
    <div className="result-review-page">
      <div className="review-container">
        {/* Top Breadcrumb & Action */}
        <div className="review-top-nav">
          <Link to="/dashboard" className="back-link">
            &larr; Back to Dashboard
          </Link>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Results
          </button>
        </div>

        {/* Score Summary Banner */}
        <div className="score-hero-card">
          <div className="score-hero-main">
            <div className="hero-domain-title">
              <h2>{result.categoryTitle}</h2>
              <div className="hero-badges">
                <span className={`badge badge-${result.difficulty?.toLowerCase()}`}>
                  {result.difficulty}
                </span>
                <span className={`attempt-pill ${result.attemptNumber === 1 ? 'pill-baseline' : 'pill-retake'}`}>
                  {result.attemptNumber === 1 ? 'Attempt 1: Baseline' : 'Attempt 2: Final Retake'}
                </span>
                <span className={`status-pill ${result.status === 'COMPLETED' ? 'status-completed' : 'status-timedout'}`}>
                  {result.status === 'COMPLETED' ? 'Completed' : 'Timed Out'}
                </span>
              </div>
            </div>

            <div className="score-circle-container">
              <div className="score-big-number">
                <span className={`score-value ${getPercentageColor(result.percentage)}`}>
                  {result.score}
                </span>
                <span className="score-total">/ {result.total}</span>
              </div>
              <div className="score-percentage-tag">
                {result.percentage}% Score
              </div>
            </div>
          </div>

          {/* Warm Empathic Feedback Box */}
          <div className="score-feedback-callout">
            <span className="feedback-emoji">{feedback.emoji}</span>
            <div>
              <strong className="feedback-title">{feedback.title}</strong>
              <p className="feedback-desc">{feedback.desc}</p>
            </div>
          </div>

          {/* Quick Metrics Breakdown Strip */}
          <div className="score-metrics-strip">
            <div className="metric-item">
              <span className="metric-dot dot-correct"></span>
              <span className="metric-label">Correct:</span>
              <strong className="metric-val">{correctAnswersCount}</strong>
            </div>
            <div className="metric-item">
              <span className="metric-dot dot-incorrect"></span>
              <span className="metric-label">Incorrect:</span>
              <strong className="metric-val">{incorrectAnswersCount}</strong>
            </div>
            <div className="metric-item">
              <span className="metric-dot dot-unanswered"></span>
              <span className="metric-label">Unanswered:</span>
              <strong className="metric-val">{unansweredCount}</strong>
            </div>
            {result.durationSeconds !== undefined && (
              <div className="metric-item">
                <span className="metric-label">Time Spent:</span>
                <strong className="metric-val">
                  {Math.floor(result.durationSeconds / 60)}m {result.durationSeconds % 60}s
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Header with Filters */}
        <div className="breakdown-header">
          <h3>Question-by-Question Audit & Explanations</h3>
          <div className="filter-button-group">
            <button
              onClick={() => setFilter('ALL')}
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            >
              All ({result.answers.length})
            </button>
            <button
              onClick={() => setFilter('CORRECT')}
              className={`filter-btn ${filter === 'CORRECT' ? 'active' : ''}`}
            >
              Correct ({correctAnswersCount})
            </button>
            <button
              onClick={() => setFilter('INCORRECT')}
              className={`filter-btn ${filter === 'INCORRECT' ? 'active' : ''}`}
            >
              Incorrect / Missed ({incorrectAnswersCount + unansweredCount})
            </button>
          </div>
        </div>

        {/* Review Questions List */}
        <div className="questions-audit-list">
          {filteredAnswers.map((ans, idx) => {
            const originalIndex = result.answers.findIndex((a) => a.questionId === ans.questionId);

            return (
              <div
                key={ans.questionId}
                className={`audit-question-card ${ans.isCorrect ? 'card-correct' : 'card-incorrect'}`}
              >
                <div className="audit-card-header">
                  <div className="audit-q-index">
                    <span className="index-pill">Q{originalIndex + 1}</span>
                    <span className="question-audit-text">{ans.questionText}</span>
                  </div>
                  <div className="audit-status-tag">
                    {ans.isCorrect ? (
                      <span className="badge-tag correct-tag">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Correct (+1)
                      </span>
                    ) : (
                      <span className="badge-tag incorrect-tag">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {ans.selectedOption ? 'Incorrect (0)' : 'Unanswered (0)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4 Options Color Breakdown */}
                <div className="audit-options-grid">
                  {[
                    { key: 'A', text: ans.optionA },
                    { key: 'B', text: ans.optionB },
                    { key: 'C', text: ans.optionC },
                    { key: 'D', text: ans.optionD },
                  ].map((opt) => {
                    const isCorrectOption = opt.key === ans.correctOption;
                    const isCandidateChoice = opt.key === ans.selectedOption;

                    let optionStateClass = 'option-neutral';
                    if (isCorrectOption) {
                      optionStateClass = 'option-correct';
                    } else if (isCandidateChoice && !ans.isCorrect) {
                      optionStateClass = 'option-wrong';
                    }

                    return (
                      <div key={opt.key} className={`audit-option-box ${optionStateClass}`}>
                        <div className="audit-bubble">{opt.key}</div>
                        <div className="audit-opt-text">{opt.text}</div>
                        <div className="audit-opt-labels">
                          {isCorrectOption && (
                            <span className="tag-correct-answer">Correct Answer</span>
                          )}
                          {isCandidateChoice && (
                            <span className={`tag-candidate-choice ${isCorrectOption ? 'is-match' : 'is-mismatch'}`}>
                              Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* In-Depth Explanation Box */}
                <div className="audit-explanation-box">
                  <div className="explanation-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <strong>Explanation:</strong>
                  </div>
                  <p className="explanation-content">{ans.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="review-footer-cta">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Return to Assessment Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
