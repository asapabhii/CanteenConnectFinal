import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
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