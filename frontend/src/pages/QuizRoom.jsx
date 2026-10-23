import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { attemptApi, categoryApi, questionApi } from '../api/endpoints';
import { QuestionPalette } from '../components/QuestionPalette';
import { Modal } from '../components/Modal';

export const QuizRoom = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attemptData, setAttemptData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSubmittingRef = useRef(false);

  // Initialize quiz state
  useEffect(() => {
    const initQuiz = async () => {
      try {
        setLoading(true);
        // Check if quizData was passed from dashboard navigate()
        if (location.state?.quizData) {
          const data = location.state.quizData;
          setAttemptData(data);
          setQuestions(data.questions || []);
          setTimeLeftSeconds((data.timerMinutes || 10) * 60);
          setLoading(false);
        } else {
          // If user directly navigated or refreshed, start a new attempt or fetch questions
          const startRes = await attemptApi.start(categoryId);
          setAttemptData(startRes.data);
          setQuestions(startRes.data.questions || []);
          setTimeLeftSeconds((startRes.data.timerMinutes || 10) * 60);
          setLoading(false);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Could not launch quiz room. You may have exceeded attempts.';
        setError(msg);
        setLoading(false);
      }
    };

    initQuiz();
  }, [categoryId, location.state]);

  // Handle final submission (called manually or automatically when timer expires)
  const handleFinalSubmit = useCallback(async () => {
    if (isSubmittingRef.current || !attemptData) return;
    isSubmittingRef.current = true;
    setSubmitting(true);

    try {
      // Format answers payload
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] || null,
      }));

      const res = await attemptApi.submit({
        attemptId: attemptData.attemptId,
        answers: formattedAnswers,
      });

      navigate(`/results/${attemptData.attemptId}`, {
        state: { resultData: res.data },
        replace: true,
      });
    } catch (err) {
      console.error('Submission failed', err);
      setError('An error occurred during quiz submission. Please try again.');
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  }, [attemptData, questions, answers, navigate]);

  // Countdown Timer Hook
  useEffect(() => {
    if (loading || timeLeftSeconds <= 0 || !attemptData) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time reaches zero!
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeftSeconds, attemptData, handleFinalSubmit]);

  // Option selection
  const selectOption = useCallback((optionKey) => {
    if (!questions[currentIndex]) return;
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  }, [questions, currentIndex]);

  // Clear answer for current question
  const clearCurrentAnswer = () => {
    if (!questions[currentIndex]) return;
    const currentQ = questions[currentIndex];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
  };

  // Keyboard Shortcuts (1-4, A-D, Arrows for navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if modal is open or input focused
      if (isSubmitModalOpen) return;
      const key = e.key.toUpperCase();

      if (key === '1' || key === 'A') {
        selectOption('A');
      } else if (key === '2' || key === 'B') {
        selectOption('B');
      } else if (key === '3' || key === 'C') {
        selectOption('C');
      } else if (key === '4' || key === 'D') {
        selectOption('D');
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, isSubmitModalOpen, selectOption]);

  // Format MM:SS for countdown
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k]).length;
  const unansweredCount = questions.length - answeredCount;
  const isTimeCritical = timeLeftSeconds < 60; // Under 1 minute

  if (loading) {
    return (
      <div className="quiz-loading-screen">
        <div className="spinner"></div>
        <h2>Initializing Exam Environment...</h2>
        <p>Validating session and synchronizing timer with server</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error-screen">
        <div className="error-card">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>Examination Notice</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = currentQ ? answers[currentQ.id] : null;

  return (
    <div className="quiz-room-page">
      {/* Quiz Top Action Bar */}
      <header className="quiz-topbar">
        <div className="quiz-meta-info">
          <span className="quiz-domain-tag">{attemptData?.categoryTitle}</span>
          <span className="quiz-attempt-badge">
            {attemptData?.attemptNumber === 1 ? 'Attempt 1: Baseline' : 'Attempt 2: Retake'}
          </span>
        </div>

        {/* Live Timer Pill */}
        <div className={`quiz-timer-pill ${isTimeCritical ? 'timer-critical pulse-animation' : ''}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="timer-digits">{formatTime(timeLeftSeconds)}</span>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="btn btn-success btn-finish-quiz"
        >
          Submit Examination
        </button>
      </header>

      {/* Main Examination Workspace */}
      <div className="quiz-body-layout">
        {/* Question Area */}
        <main className="quiz-question-container">
          <div className="question-header-row">
            <div className="question-number-badge">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="keyboard-hint-pill">
              <span>Keys: 1-4 or A-D to select | &larr; &rarr; to navigate</span>
            </div>
          </div>

          <div className="question-text-card">
            <p className="question-text">{currentQ?.text}</p>
          </div>

          {/* 4 Interactive Option Buttons */}
          <div className="options-list">
            {[
              { key: 'A', text: currentQ?.optionA },
              { key: 'B', text: currentQ?.optionB },
              { key: 'C', text: currentQ?.optionC },
              { key: 'D', text: currentQ?.optionD },
            ].map((opt) => {
              const isSelected = selectedOption === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => selectOption(opt.key)}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                >
                  <div className="option-key-bubble">{opt.key}</div>
                  <div className="option-text-content">{opt.text}</div>
                  {isSelected && (
                    <div className="option-check-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation Toolbar */}
          <div className="quiz-bottom-toolbar">
            <button
              onClick={clearCurrentAnswer}
              disabled={!selectedOption}
              className="btn btn-ghost btn-sm"
            >
              Clear Choice
            </button>

            <div className="nav-buttons-group">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn btn-secondary"
              >
                &larr; Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-primary"
                >
                  Next &rarr;
                </button>
              ) : (
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="btn btn-success"
                >
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar Question Palette */}
        <aside className="quiz-sidebar">
          <QuestionPalette
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            questions={questions}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />

          <div className="quick-info-card">
            <h4>Integrity Reminder</h4>
            <p>
              Timer is validated on the server. Do not navigate away or refresh. Submissions after time expiry will be recorded as timed out.
            </p>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Assessment"
        footer={
          <>
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Return to Exam
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? 'Submitting...' : 'Confirm Final Submission'}
            </button>
          </>
        }
      >
        <div className="submit-modal-content">
          <p>Are you sure you want to finalize and submit your assessment?</p>
          <div className="modal-summary-grid">
            <div className="modal-stat-box answered">
              <span className="stat-num">{answeredCount}</span>
              <span className="stat-label">Answered</span>
            </div>
            <div className="modal-stat-box unanswered">
              <span className="stat-num">{unansweredCount}</span>
              <span className="stat-label">Unanswered</span>
            </div>
            <div className="modal-stat-box time">
              <span className="stat-num">{formatTime(timeLeftSeconds)}</span>
              <span className="stat-label">Time Remaining</span>
            </div>
          </div>
          {unansweredCount > 0 && (
            <div className="alert alert-warning mt-3">
              You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions will receive 0 points.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
