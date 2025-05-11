// src/lib/authFetch.js

export async function authFetch(url, options = {}) {
    const base = import.meta.env.VITE_API_BASE || '';
    const fullUrl = base + url;
  
    const accessToken = localStorage.getItem('access_token');
  
    let res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
  
    if (res.status !== 401) {
      return res;
    }
  
    // access_token просрочен → пытаемся обновить
    const refresh = await fetch(base + '/user/refresh', {
      method: 'POST',
      credentials: 'include',
    });
  
    if (!refresh.ok) {
      throw new Error('Не удалось обновить токен');
    }
  
    const data = await refresh.json();
    const newToken = data.access_token;
  
    // сохраняем в localStorage для последующих запросов
    localStorage.setItem('access_token', newToken);
  
    // Повторяем оригинальный запрос с новым токеном
    return fetch(fullUrl, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
      credentials: 'include',
    });
  }
  