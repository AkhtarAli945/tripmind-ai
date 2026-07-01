import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const tripsApi = {
  getAll: (params) => api.get('/trips', { params }),
  getOne: (id) => api.get(`/trips/${id}`),
  getDetails: (id) => api.get(`/trips/${id}/details`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const chatApi = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
};

export default api;
