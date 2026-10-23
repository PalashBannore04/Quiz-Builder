import React from 'react';

export const QuestionPalette = ({
  totalQuestions,
  currentIndex,
  answers,
  questions,
  onSelectQuestion,
}) => {
  return (
    <div className="palette-card">
      <div className="palette-header">
        <h4 className="palette-title">Question Palette</h4>
        <div className="palette-summary">
          <span className="summary-badge answered-count">
            {Object.keys(answers).filter(k => answers[k]).length}/{totalQuestions} Answered
          </span>
        </div>
      </div>

      <div className="palette-grid">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = currentIndex === idx;

          let btnClass = 'palette-btn';
          if (isCurrent) btnClass += ' current';
          if (isAnswered) btnClass += ' answered';
          else btnClass += ' unanswered';

          return (
            <button
              key={q.id}
              className={btnClass}
              onClick={() => onSelectQuestion(idx)}
              title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Not answered'}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="palette-legend">
        <div className="legend-item">
          <span className="legend-dot answered"></span>
          <span>Answered</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unanswered"></span>
          <span>Unanswered</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot current"></span>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};
