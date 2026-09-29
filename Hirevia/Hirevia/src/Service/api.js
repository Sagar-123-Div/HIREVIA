const axios = require('axios');

/**
 * Configure the backend URL in your environment, for example:
 *   API_BASE_URL=http://localhost:3000/api
 *
 * Optionally supply an auth token through API_TOKEN.
 */
const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  timeout: Number(process.env.API_TIMEOUT_MS) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = process.env.API_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed';

    return Promise.reject(new Error(status ? `HTTP ${status}: ${message}` : message));
  },
);

module.exports = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
  client: api,
};

/*
Usage:

const api = require('./api');

async function loadUsers() {
  const users = await api.get('/users');
  return users;
}
*/
