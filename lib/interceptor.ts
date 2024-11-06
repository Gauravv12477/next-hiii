import { store } from '@/store/store';
import { logout } from '@/store/userSlice';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to safely get the token on the client-side
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const token = getToken();

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor to attach token if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    if (token && config.headers) {
      // Type assertion to ensure headers type compatibility
      config.headers.Authorization = `Bearer ${token}` as string;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    const response = error.response;
    if (response && response.status === 401) {
      // Optional: Handle unauthorized errors, such as redirecting to login
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
