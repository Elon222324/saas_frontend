// src/lib/authFetch.js

export async function authFetch(url, options = {}) {
    const base = import.meta.env.VITE_API_BASE || ''; // если хочешь поддерживать .env
    const fullUrl = base + url;

    const res = await fetch(fullUrl, {
        ...options,
        credentials: 'include', // важно: куки с refresh токеном
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

    // Повторяем оригинальный запрос с новым access_token
    return fetch(fullUrl, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
        },
        credentials: 'include',
    });
}
