// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export const tripsApi = {
//   getAll: (params) => api.get('/trips', { params }),
//   getOne: (id) => api.get(`/trips/${id}`),
//   getDetails: (id) => api.get(`/trips/${id}/details`),
//   create: (data) => api.post('/trips', data),
//   update: (id, data) => api.put(`/trips/${id}`, data),
//   delete: (id) => api.delete(`/trips/${id}`),
// };

// export const chatApi = {
//   sendMessage: (data) => api.post('/chat/message', data),
//   getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
// };

// export default api;






import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
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