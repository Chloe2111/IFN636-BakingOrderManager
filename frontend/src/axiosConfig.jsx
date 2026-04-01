import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  headers: { 'Content-Type': 'application/json' },
});

// ADD THIS: This "Interceptor" attaches the token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or however you store it in AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;