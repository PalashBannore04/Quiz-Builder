import React, { useState, useEffect } from 'react';
import { categoryApi, questionApi } from '../api/endpoints';
import { Modal } from '../components/Modal';

export const QuestionManager = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Domain Modal State
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [domainForm, setDomainForm] = useState({
    id: null,
    title: '',
    description: '',
    difficulty: 'Medium',
    timerMinutes: 10,
  });

  // Question Modal State
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    id: null,
    categoryId: '',
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    explanation: '',
  });

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'DOMAIN' | 'QUESTION', id, title }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [selectedCategoryFilter]);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories');
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionApi.getForAdmin(selectedCategoryFilter || null);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load question bank');
    } finally {
      setLoading(false);
    }
  };

  // Domain CRUD
  const openCreateDomain = () => {
    setDomainForm({
      id: null,
      title: '',
      description: '',
      difficulty: 'Medium',
      timerMinutes: 10,
    });
    setDomainModalOpen(true);
  };

  const openEditDomain = (cat) => {
    setDomainForm({
      id: cat.id,
      title: cat.title,
      description: cat.description || '',
      difficulty: cat.difficulty,
      timerMinutes: cat.timerMinutes,
    });
    setDomainModalOpen(true);
  };

  const handleSaveDomain = async (e) => {
    e.preventDefault();
    try {
      if (domainForm.id) {
        await categoryApi.update(domainForm.id, domainForm);
        setSuccessMsg('Domain updated successfully.');
      } else {
        await categoryApi.create(domainForm);
        setSuccessMsg('Domain created successfully.');
      }
      setDomainModalOpen(false);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save domain.');
    }
  };

  // Question CRUD
  const openCreateQuestion = () => {
    const defaultCatId = selectedCategoryFilter || (categories[0]?.id ? String(categories[0].id) : '');
    setQuestionForm({
      id: null,
      categoryId: defaultCatId,
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      explanation: '',
    });
    setQuestionModalOpen(true);
  };

  const openEditQuestion = (q) => {
    setQuestionForm({
      id: q.id,
      categoryId: String(q.categoryId),
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: q.explanation,
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...questionForm,
        categoryId: Number(questionForm.categoryId),
      };

      if (questionForm.id) {
        await questionApi.update(questionForm.id, payload);
        setSuccessMsg('Question updated successfully.');
      } else {
        await questionApi.create(payload);
        setSuccessMsg('Question added to curriculum.');
      }
      setQuestionModalOpen(false);
      await loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question.');
    }
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'DOMAIN') {
        await categoryApi.delete(deleteTarget.id);
        setSuccessMsg('Domain deleted successfully.');
        await loadCategories();
        if (selectedCategoryFilter === String(deleteTarget.id)) {
          setSelectedCategoryFilter('');
        }
      } else {
        await questionApi.delete(deleteTarget.id);
        setSuccessMsg('Question removed from curriculum.');
        await loadQuestions();
      }
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete operation failed.');
    }
  };

  return (
    <div className="question-manager-page">
      <div className="manager-container">
        <div className="manager-header">
          <div>
            <h1>Curriculum & Question Bank Management</h1>
            <p className="text-muted">
              Create and manage assessment categories and maintain rigorous 4-option question items.
            </p>
          </div>

          <div className="manager-header-actions">
            <button onClick={openCreateDomain} className="btn btn-secondary">
              + New Domain
            </button>
            <button onClick={openCreateQuestion} className="btn btn-primary">
              + Add Question
            </button>
          </div>
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

        {/* Domains Management Cards Strip */}
        <section className="admin-domains-overview">
          <div className="section-subtitle-bar">
            <h3>Active Domains ({categories.length})</h3>
          </div>
          <div className="admin-domains-grid">
            {categories.map((c) => (
              <div key={c.id} className="admin-domain-chip">
                <div className="chip-header">
                  <strong>{c.title}</strong>
                  <span className={`badge badge-${c.difficulty?.toLowerCase()}`}>{c.difficulty}</span>
                </div>
                <div className="chip-meta">
                  <span>{c.timerMinutes} mins</span> &bull; <span>{c.questionCount} Questions</span>
                </div>
                <div className="chip-actions">
                  <button onClick={() => openEditDomain(c)} className="btn-icon" title="Edit Domain">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTarget({ type: 'DOMAIN', id: c.id, title: c.title });
                      setDeleteConfirmOpen(true);
                    }}
                    className="btn-icon danger"
                    title="Delete Domain"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Toolbar for Questions */}
        <section className="questions-bank-section">
          <div className="filter-toolbar">
            <div className="filter-group">
              <label htmlFor="filterCat">Filter by Domain:</label>
              <select
                id="filterCat"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="form-select"
              >
                <option value="">All Domains ({questions.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="counter-tag">
              Showing <strong>{questions.length}</strong> Questions
            </div>
          </div>

          {/* Questions Table */}
          {loading ? (
            <div className="loading-area">
              <div className="spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-table-box">
              <p>No questions found for the selected filter.</p>
              <button onClick={openCreateQuestion} className="btn btn-primary mt-2">
                Add the First Question
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table questions-table">
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>Domain</th>
                    <th style={{ width: '38%' }}>Question Text</th>
                    <th style={{ width: '15%' }}>Options (A-D)</th>
                    <th style={{ width: '8%' }}>Answer</th>
                    <th style={{ width: '17%' }}>Explanation</th>
                    <th style={{ width: '10%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id}>
                      <td>
                        <span className="badge badge-secondary">{q.categoryTitle}</span>
                      </td>
                      <td>
                        <strong className="q-text-truncate">{q.text}</strong>
                      </td>
                      <td>
                        <div className="options-summary">
                          <div><strong>A:</strong> {q.optionA}</div>
                          <div><strong>B:</strong> {q.optionB}</div>
                          <div><strong>C:</strong> {q.optionC}</div>
                          <div><strong>D:</strong> {q.optionD}</div>
                        </div>
                      </td>
                      <td>
                        <span className="correct-opt-tag">{q.correctOption}</span>
                      </td>
                      <td>
                        <p className="explanation-truncate">{q.explanation}</p>
                      </td>
                      <td>
                        <div className="row-action-btns">
                          <button
                            onClick={() => openEditQuestion(q)}
                            className="btn btn-outline btn-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({ type: 'QUESTION', id: q.id, title: q.text });
                              setDeleteConfirmOpen(true);
                            }}
                            className="btn btn-danger btn-xs"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Domain Modal */}
      <Modal
        isOpen={domainModalOpen}
        onClose={() => setDomainModalOpen(false)}
        title={domainForm.id ? 'Edit Domain' : 'Create Evaluation Domain'}
      >
        <form onSubmit={handleSaveDomain} className="modal-form">
          <div className="form-group">
            <label>Domain Title *</label>
            <input
              type="text"
              value={domainForm.title}
              onChange={(e) => setDomainForm({ ...domainForm, title: e.target.value })}
              required
              placeholder="e.g. Cloud Architecture & Kubernetes"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={domainForm.description}
              onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })}
              placeholder="Summary of skills evaluated..."
              rows={3}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group col">
              <label>Difficulty *</label>
              <select
                value={domainForm.difficulty}
                onChange={(e) => setDomainForm({ ...domainForm, difficulty: e.target.value })}
                className="form-select"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group col">
              <label>Timer (Minutes) *</label>
              <input
                type="number"
                min="1"
                max="180"
                value={domainForm.timerMinutes}
                onChange={(e) => setDomainForm({ ...domainForm, timerMinutes: Number(e.target.value) })}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-form-actions">
            <button type="button" onClick={() => setDomainModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {domainForm.id ? 'Save Changes' : 'Create Domain'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Question Modal */}
      <Modal
        isOpen={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        title={questionForm.id ? 'Edit Question' : 'Add New Question'}
      >
        <form onSubmit={handleSaveQuestion} className="modal-form">
          <div className="form-group">
            <label>Domain / Category *</label>
            <select
              value={questionForm.categoryId}
              onChange={(e) => setQuestionForm({ ...questionForm, categoryId: e.target.value })}
              required
              className="form-select"
            >
              <option value="">Select Domain...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Question Prompt *</label>
            <textarea
              value={questionForm.text}
              onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
              required
              rows={3}
              placeholder="Enter precise question scenario or statement..."
              className="form-textarea"
            />
          </div>

          <div className="options-input-grid">
            <div className="form-group">
              <label>Option A *</label>
              <input
                type="text"
                value={questionForm.optionA}
                onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Option B *</label>
              <input
                type="text"
                value={questionForm.optionB}
                onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Option C *</label>
              <input
                type="text"
                value={questionForm.optionC}
                onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Option D *</label>
              <input
                type="text"
                value={questionForm.optionD}
                onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correct Option *</label>
            <div className="correct-radio-group">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <label key={opt} className={`radio-pill ${questionForm.correctOption === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="correctOption"
                    value={opt}
                    checked={questionForm.correctOption === opt}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctOption: e.target.value })}
                  />
                  Option {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Explanation & Rationale *</label>
            <textarea
              value={questionForm.explanation}
              onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
              required
              rows={3}
              placeholder="Why is this option correct and what are the key takeaways?..."
              className="form-textarea"
            />
          </div>

          <div className="modal-form-actions">
            <button type="button" onClick={() => setQuestionModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {questionForm.id ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <button onClick={() => setDeleteConfirmOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Yes, Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this {deleteTarget?.type === 'DOMAIN' ? 'domain' : 'question'}?
        </p>
        <p className="text-muted">
          <em>"{deleteTarget?.title}"</em>
        </p>
        {deleteTarget?.type === 'DOMAIN' && (
          <p className="alert alert-warning mt-2">
            Deleting a domain will also remove all questions and past attempts associated with it!
          </p>
        )}
      </Modal>
    </div>
  );
};
