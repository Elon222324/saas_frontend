/**
 * API модуль для работы с пользователями системы (Owner Panel)
 * Использует токен пользователя (User Access Token) для доступа к центральному API админки
 * Все эндпоинты требуют роль super_admin
 */

const API_URL = import.meta.env.VITE_API_URL

/**
 * Получает токен пользователя из localStorage
 * @returns {string | null} access_token или null
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

/**
 * Получает список всех пользователей системы
 * Требует роль super_admin
 * 
 * @returns {Promise<Array>} Массив пользователей
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function fetchAllUsers() {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🔐 [fetchAllUsers] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🔐 [fetchAllUsers] → Запрос к:', `${API_URL}/user/get`)
  console.log('🔐 [fetchAllUsers] → Токен присутствует:', accessToken ? 'Да' : 'Нет')

  const response = await fetch(`${API_URL}/user/get`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('🔐 [fetchAllUsers] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🔐 [fetchAllUsers] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🔐 [fetchAllUsers] ← Сырые данные от бэкенда:', data)
  console.log('🔐 [fetchAllUsers] ← Тип данных:', Array.isArray(data) ? 'Array' : typeof data)
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    console.log('🔐 [fetchAllUsers] ← Ключи объекта:', Object.keys(data))
  }

  const result = Array.isArray(data) ? data : (data?.users || data?.results || data?.data || [])
  console.log('🔐 [fetchAllUsers] ✅ Обработанные данные:', result)
  console.log('🔐 [fetchAllUsers] ✅ Количество пользователей:', result.length)
  
  if (result.length > 0) {
    console.log('🔐 [fetchAllUsers] ✅ Пример первого пользователя:', result[0])
  }

  return result
}

/**
 * Обновляет данные пользователя
 * Требует роль super_admin
 * 
 * @param {number|string} userId - ID пользователя
 * @param {Object} userData - Данные для обновления
 * @returns {Promise<Object>} Обновленные данные пользователя
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function updateUser(userId, userData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🔐 [updateUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🔐 [updateUser] → Обновление пользователя:', userId)
  console.log('🔐 [updateUser] → Данные для обновления:', userData)

  const response = await fetch(`${API_URL}/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  console.log('🔐 [updateUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🔐 [updateUser] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🔐 [updateUser] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Удаляет пользователя
 * Требует роль super_admin
 * 
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Object>} Результат удаления
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function deleteUser(userId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🔐 [deleteUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🔐 [deleteUser] → Удаление пользователя:', userId)

  const response = await fetch(`${API_URL}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('🔐 [deleteUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🔐 [deleteUser] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🔐 [deleteUser] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Создает нового пользователя
 * Требует роль super_admin
 * 
 * @param {Object} userData - Данные нового пользователя
 * @returns {Promise<Object>} Созданный пользователь
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function createUser(userData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🔐 [createUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🔐 [createUser] → Создание пользователя')
  console.log('🔐 [createUser] → Данные:', userData)

  const response = await fetch(`${API_URL}/user/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  console.log('🔐 [createUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🔐 [createUser] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🔐 [createUser] ✅ Ответ от бэкенда:', data)
  return data
}

