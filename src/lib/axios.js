import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Добавляем заголовок Authorization перед каждым запросом
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Отключаем кэширование для GET-запросов
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔄 Перехватчик ошибок
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // Если access_token истёк и это не /refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refresh')
    ) {
      originalRequest._retry = true

      try {
        const refreshRes = await api.post('/user/refresh')
        const newAccessToken = refreshRes.data.access_token
        localStorage.setItem('access_token', newAccessToken)

        // Обновим заголовок и повторим оригинальный запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Ошибка при обновлении токена:', refreshError)
        // можно: redirect на login
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
