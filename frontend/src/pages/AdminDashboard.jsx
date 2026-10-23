import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/endpoints';
import { Modal } from '../components/Modal';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDomains: 0,
    activeQuestions: 0,
    registeredStudents: 0,
    attemptsEvaluated: 0,
  });

  const [submissions, setSubmissions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [domains, setDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'candidates' | 'domains'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Audit Modal State
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  // Reset Seed Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, subRes, candRes, domRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getSubmissions(),
        adminApi.getCandidates(),
        adminApi.getDomainPerformances(),
      ]);
      setStats(statsRes.data);
      setSubmissions(subRes.data);
      setCandidates(candRes.data);
      setDomains(domRes.data);
    } catch (err) {
      setError('Failed to fetch administrator analytics. Please verify your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAudit = async (attemptId) => {
    try {
      setAuditLoading(true);
      setAuditModalOpen(true);
      const res = await adminApi.getAttemptAudit(attemptId);
      setAuditData(res.data);
    } catch (err) {
      console.error('Audit fetch failed', err);
      setError('Unable to load attempt audit details.');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleResetSeedData = async () => {
    try {
      setResetting(true);
      setError('');
      const res = await adminApi.resetSeed();
      setSuccessMsg(res.data.message || 'Seed data successfully reset to defaults.');
      setResetModalOpen(false);
      await fetchAdminData();
    } catch (err) {
      console.error('Reset failed', err);
      setError('Failed to reset database seed data.');
    } finally {
      setResetting(false);
    }
  };

  const getDeltaBadge = (tracker) => {
    if (tracker.scoreDelta === null || tracker.scoreDelta === undefined) {
      return <span className="delta-pill delta-baseline">Baseline (Attempt 1)</span>;
    }
    if (tracker.scoreDelta > 0) {
      return <span className="delta-pill delta-positive">+{tracker.scoreDelta} Imprv</span>;
    }
    if (tracker.scoreDelta < 0) {
      return <span className="delta-pill delta-negative">{tracker.scoreDelta} Drop</span>;
    }
    return <span className="delta-pill delta-neutral">0 (Same)</span>;
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        {/* Header with Reset Seed Action */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-title">System Administrator Console</h1>
            <p className="admin-subtitle">
              Monitor evaluation progress, inspect score deltas across attempts, audit candidate submissions, and manage curriculum.
            </p>
          </div>

          <button
            onClick={() => setResetModalOpen(true)}
            className="btn btn-danger btn-reset-seed"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Reset Seed Data
          </button>
        </div>

        {error && (
          <div className="alert alert-danger dismissible-alert">
            <span>{error}</span>
            <button onClick={() => setError('')} className="alert-close">&times;</button>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success dismissible-alert">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="alert-close">&times;</button>
          </div>
        )}

        {/* 4 Analytics KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon icon-domains">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Total Domains</span>
              <h3 className="kpi-value">{stats.totalDomains}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon icon-questions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Active Questions</span>
              <h3 className="kpi-value">{stats.activeQuestions}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon icon-students">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Registered Candidates</span>
              <h3 className="kpi-value">{stats.registeredStudents}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon icon-attempts">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Evaluations Evaluated</span>
              <h3 className="kpi-value">{stats.attemptsEvaluated}</h3>
            </div>
          </div>
        </div>

        {/* Tabbed Tables Navigation */}
        <div className="admin-tabs-bar">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`admin-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          >
            Submission Tracker & Score Delta ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`admin-tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          >
            Registered Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('domains')}
            className={`admin-tab-btn ${activeTab === 'domains' ? 'active' : ''}`}
          >
            Domain Performance ({domains.length})
          </button>
        </div>

        {/* Tab 1: Submission Tracker */}
        {activeTab === 'submissions' && (
          <div className="tab-table-card">
            <div className="tab-table-header">
              <h3>Submission & Quota Progression Tracker</h3>
              <p className="text-muted">
                Evaluates candidate baseline vs final retake scores, tracking exact delta gains across attempts.
              </p>
            </div>

            {submissions.length === 0 ? (
              <p className="empty-table-msg">No submissions recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Domain</th>
                      <th>Attempt Quota</th>
                      <th>Previous Attempt</th>
                      <th>Latest Attempt</th>
                      <th>Score Delta</th>
                      <th>Timestamp</th>
                      <th>Audit Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, i) => (
                      <tr key={`${sub.userId}-${sub.categoryId}-${i}`}>
                        <td>
                          <strong>{sub.candidateName}</strong>
                          <div className="text-muted small">{sub.candidateEmail}</div>
                        </td>
                        <td>
                          <strong>{sub.domainTitle}</strong>
                        </td>
                        <td>
                          <span className="quota-tag-pill">{sub.attemptQuota}</span>
                        </td>
                        <td>
                          <span className="score-mono">{sub.previousAttemptDisplay}</span>
                        </td>
                        <td>
                          <span className="score-mono font-bold">{sub.latestAttemptDisplay}</span>
                        </td>
                        <td>{getDeltaBadge(sub)}</td>
                        <td className="text-muted small">
                          {sub.submittedAt
                            ? new Date(sub.submittedAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </td>
                        <td>
                          <button
                            onClick={() => handleOpenAudit(sub.attemptId)}
                            className="btn btn-outline btn-sm"
                          >
                            View Audit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Registered Candidates */}
        {activeTab === 'candidates' && (
          <div className="tab-table-card">
            <div className="tab-table-header">
              <h3>Registered Candidate Analytics</h3>
              <p className="text-muted">Overview of candidate engagements, cumulative attempts, and mean score performance.</p>
            </div>

            {candidates.length === 0 ? (
              <p className="empty-table-msg">No candidate users registered.</p>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Email</th>
                      <th>Attempts Completed</th>
                      <th>Average Score</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((cand) => (
                      <tr key={cand.id}>
                        <td><strong>{cand.name}</strong></td>
                        <td className="text-muted">{cand.email}</td>
                        <td>
                          <span className="badge badge-secondary">{cand.attemptsCount} attempts</span>
                        </td>
                        <td>
                          <strong>
                            {cand.averageScore !== null ? `${cand.averageScore}%` : 'N/A'}
                          </strong>
                        </td>
                        <td className="text-muted small">
                          {cand.joinDate ? new Date(cand.joinDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Domain Performance */}
        {activeTab === 'domains' && (
          <div className="tab-table-card">
            <div className="tab-table-header">
              <h3>Domain Performance Benchmarks</h3>
              <p className="text-muted">Domain difficulty distribution, question bank size, and average cohort scores.</p>
            </div>

            {domains.length === 0 ? (
              <p className="empty-table-msg">No domains configured.</p>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Domain Name</th>
                      <th>Difficulty</th>
                      <th>Questions Count</th>
                      <th>Total Submissions</th>
                      <th>Cohort Average Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((dom) => (
                      <tr key={dom.id}>
                        <td><strong>{dom.title}</strong></td>
                        <td>
                          <span className={`badge badge-${dom.difficulty?.toLowerCase()}`}>
                            {dom.difficulty}
                          </span>
                        </td>
                        <td>{dom.questionCount}</td>
                        <td>{dom.submissionCount}</td>
                        <td>
                          <strong>
                            {dom.averageScore !== null ? `${dom.averageScore}%` : 'No submissions'}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer Audit Modal */}
      <Modal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        title="Candidate Submission Answer Audit"
        footer={
          <button onClick={() => setAuditModalOpen(false)} className="btn btn-secondary">
            Close Audit
          </button>
        }
      >
        {auditLoading ? (
          <div className="modal-spinner">
            <div className="spinner"></div>
            <p>Retrieving answer telemetry...</p>
          </div>
        ) : auditData ? (
          <div className="audit-modal-body">
            <div className="audit-top-summary">
              <div>
                <h4>{auditData.categoryTitle}</h4>
                <div className="audit-sub-meta">
                  <span>Attempt #{auditData.attemptNumber}</span> &bull;{' '}
                  <span className="status-pill status-completed">{auditData.status}</span>
                </div>
              </div>
              <div className="audit-score-badge">
                <span className="audit-score-val">{auditData.score} / {auditData.total}</span>
                <span className="audit-pct-val">({auditData.percentage}%)</span>
              </div>
            </div>

            <div className="audit-answers-scroll">
              {auditData.answers.map((ans, idx) => (
                <div
                  key={ans.questionId}
                  className={`modal-q-item ${ans.isCorrect ? 'item-correct' : 'item-incorrect'}`}
                >
                  <div className="modal-q-title">
                    <strong>Q{idx + 1}:</strong> {ans.questionText}
                  </div>
                  <div className="modal-options-mini">
                    {['A', 'B', 'C', 'D'].map((key) => {
                      const text = ans[`option${key}`];
                      const isCorrect = key === ans.correctOption;
                      const isChosen = key === ans.selectedOption;

                      let cls = 'mini-opt';
                      if (isCorrect) cls += ' correct';
                      if (isChosen && !isCorrect) cls += ' wrong';

                      return (
                        <div key={key} className={cls}>
                          <span className="opt-key">{key}:</span> {text}
                          {isCorrect && <span className="mini-tag">Correct</span>}
                          {isChosen && <span className="mini-tag chosen">Chosen</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="modal-explanation">
                    <strong>Explanation:</strong> {ans.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No audit details available.</p>
        )}
      </Modal>

      {/* Confirmation Modal for Reset Seed Data */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Confirm Reset Seed Data"
        footer={
          <>
            <button
              onClick={() => setResetModalOpen(false)}
              disabled={resetting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleResetSeedData}
              disabled={resetting}
              className="btn btn-danger"
            >
              {resetting ? 'Resetting Data...' : 'Yes, Reset Database'}
            </button>
          </>
        }
      >
        <div className="reset-seed-warning">
          <p>
            Are you sure you want to reset the database seed data? This will:
          </p>
          <ul>
            <li>Restore all 6 default categories (Java, Web Dev, Python, SQL, DSA, Logic)</li>
            <li>Restore 30 curated questions with option explanations</li>
            <li>Restore candidate (`user@quizbuilder.com`) and admin (`admin@quizbuilder.com`) users</li>
            <li>Re-populate baseline and retake evaluation records for delta tracking</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};
