import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),
  getMe: () => axiosClient.get('/auth/me'),
};

export const categoryApi = {
  getAll: () => axiosClient.get('/categories'),
  getCandidateSummaries: () => axiosClient.get('/categories/candidate/summary'),
  getById: (id) => axiosClient.get(`/categories/${id}`),
  create: (data) => axiosClient.post('/categories', data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export const questionApi = {
  getForQuiz: (categoryId) => axiosClient.get(`/questions/category/${categoryId}`),
  getForAdmin: (categoryId) => axiosClient.get('/questions/admin', { params: { categoryId } }),
  getById: (id) => axiosClient.get(`/questions/${id}`),
  create: (data) => axiosClient.post('/questions', data),
  update: (id, data) => axiosClient.put(`/questions/${id}`, data),
  delete: (id) => axiosClient.delete(`/questions/${id}`),
};

export const attemptApi = {
  start: (categoryId) => axiosClient.post(`/attempts/start/${categoryId}`),
  submit: (data) => axiosClient.post('/attempts/submit', data),
  getResult: (attemptId) => axiosClient.get(`/attempts/${attemptId}/result`),
  getMyHistory: () => axiosClient.get('/attempts/my-history'),
};

export const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  getSubmissions: () => axiosClient.get('/admin/submissions'),
  getCandidates: () => axiosClient.get('/admin/candidates'),
  getDomainPerformances: () => axiosClient.get('/admin/domains/performance'),
  getAttemptAudit: (attemptId) => axiosClient.get(`/admin/attempts/${attemptId}/audit`),
  resetSeed: () => axiosClient.post('/admin/reset-seed'),
};
