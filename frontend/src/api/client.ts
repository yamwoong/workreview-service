import axios, { AxiosError } from 'axios';

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is required.');
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

client.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return config;
  }

  if (!config.headers) {
    config.headers = {};
  }

  (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      // Exclude password change endpoint from auto-logout
      // Password mismatch is a business logic error, not an auth failure
      const isPasswordChangeEndpoint = error.config?.url?.includes('/me/password');

      if (!isPasswordChangeEndpoint) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default client;

