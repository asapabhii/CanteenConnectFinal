import axios from 'axios';

// Use relative path for API calls - this works with Vercel rewrites
// and local development with Vite proxy
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');

    if (authStorage) {
      const token = JSON.parse(authStorage).state.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
);

export default apiClient;