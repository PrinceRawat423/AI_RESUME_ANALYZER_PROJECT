import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

if (typeof localStorage !== 'undefined') {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
  }
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const resumeApi = {
  upload: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  analyze: (data) => api.post('/resume/analyze', data),
  history: () => api.get('/resume/history'),
  latest: () => api.get('/resume/latest'),
};

export const interviewApi = {
  questions: (data) => api.post('/interview/questions', data),
  chat: (data) => api.post('/interview/chat', data),
};

export const feedbackApi = {
  submit: (data) => api.post('/feedback/submit', data),
  history: () => api.get('/feedback/history'),
};

export default api;
