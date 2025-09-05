import axios from 'axios';
import { API_CONFIG } from '../config/constants.js';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const moviesAPI = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),
  create: (movie) => api.post('/movies', movie),
  update: (id, movie) => api.put(`/movies/${id}`, movie),
  delete: (id) => api.delete(`/movies/${id}`),
};

// Games API
export const gamesAPI = {
  getAll: () => api.get('/games'),
  getById: (id) => api.get(`/games/${id}`),
  create: (game) => api.post('/games', game),
  update: (id, game) => api.put(`/games/${id}`, game),
  delete: (id) => api.delete(`/games/${id}`),
};

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
