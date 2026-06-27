import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authTokens, isTokenExpired } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add access token to Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = authTokens.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If error is 401
    if (error.response?.status === 401) {
      // Clear tokens
      authTokens.clearTokens();
      // Redirect to login page if not already there
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (!path.startsWith('/login') && !path.startsWith('/register')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
