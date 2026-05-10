import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || '';

  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }

  url = url.replace(/\/+$/, '');

  if (!url.endsWith('/api')) {
    url += '/api';
  }

  return url;
};
const api = axios.create({
  baseURL: getBaseURL(),
});
// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } return config;
});
// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${getBaseURL()}/auth/refresh-token`,
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new Event('logout'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;