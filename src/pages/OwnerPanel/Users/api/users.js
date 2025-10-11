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
 * Получает список всех пользователей системы (базовый, без информации о сайтах)
 * Требует роль super_admin
 * GET /api/user/get
 * 
 * @returns {Promise<Array>} Массив пользователей
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function fetchAllUsers() {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [fetchAllUsers] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [fetchAllUsers] → Запрос к:', `${API_URL}/user/get`)
  console.log('👥 [fetchAllUsers] → Токен присутствует:', accessToken ? 'Да' : 'Нет')

  const response = await fetch(`${API_URL}/user/get`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('👥 [fetchAllUsers] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('👥 [fetchAllUsers] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [fetchAllUsers] ← Сырые данные от бэкенда:', data)
  console.log('👥 [fetchAllUsers] ← Тип данных:', Array.isArray(data) ? 'Array' : typeof data)
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    console.log('👥 [fetchAllUsers] ← Ключи объекта:', Object.keys(data))
  }

  const result = Array.isArray(data) ? data : (data?.users || data?.results || data?.data || [])
  console.log('👥 [fetchAllUsers] ✅ Обработанные данные:', result)
  console.log('👥 [fetchAllUsers] ✅ Количество пользователей:', result.length)
  
  if (result.length > 0) {
    console.log('👥 [fetchAllUsers] ✅ Пример первого пользователя:', result[0])
  }

  return result
}

/**
 * Получает список всех пользователей системы с информацией о их сайтах ⭐ РЕКОМЕНДУЕТСЯ
 * Требует роль super_admin
 * GET /api/user/admin/users
 * 
 * @returns {Promise<Array>} Массив пользователей с полями sites и sites_count
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function fetchAllUsersWithSites() {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥🌐 [fetchAllUsersWithSites] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥🌐 [fetchAllUsersWithSites] → Запрос к:', `${API_URL}/user/admin/users`)
  console.log('👥🌐 [fetchAllUsersWithSites] → Токен присутствует:', accessToken ? 'Да' : 'Нет')
  console.log('👥🌐 [fetchAllUsersWithSites] → Этот эндпоинт вернет пользователей с информацией о сайтах')

  const response = await fetch(`${API_URL}/user/admin/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('👥🌐 [fetchAllUsersWithSites] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('👥🌐 [fetchAllUsersWithSites] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥🌐 [fetchAllUsersWithSites] ← 📦 СЫРЫЕ ДАННЫЕ ОТ БЭКЕНДА:', data)
  console.log('👥🌐 [fetchAllUsersWithSites] ← 📦 Тип данных:', Array.isArray(data) ? 'Array' : typeof data)
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    console.log('👥🌐 [fetchAllUsersWithSites] ← 📦 Ключи объекта:', Object.keys(data))
  }

  const result = Array.isArray(data) ? data : (data?.users || data?.results || data?.data || [])
  console.log('👥🌐 [fetchAllUsersWithSites] ✅ Обработанные данные (массив):', result)
  console.log('👥🌐 [fetchAllUsersWithSites] ✅ Количество пользователей:', result.length)
  
  if (result.length > 0) {
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 ПРИМЕР ПЕРВОГО ПОЛЬЗОВАТЕЛЯ (полный объект):', result[0])
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 Ключи первого пользователя:', Object.keys(result[0]))
    
    // Подробное логирование полей пользователя
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 user.id:', result[0].id)
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 user.user_name:', result[0].user_name)
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 user.email:', result[0].email)
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 user.role:', result[0].role)
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 user.partner_id:', result[0].partner_id)
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🔍 user.created_at:', result[0].created_at)
    
    // Логирование информации о сайтах
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 user.sites (массив сайтов):', result[0].sites)
    console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 user.sites_count:', result[0].sites_count)
    
    if (result[0].sites && Array.isArray(result[0].sites) && result[0].sites.length > 0) {
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 Количество сайтов у первого пользователя:', result[0].sites.length)
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 ПРИМЕР ПЕРВОГО САЙТА:', result[0].sites[0])
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 Ключи объекта сайта:', Object.keys(result[0].sites[0]))
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 site.id:', result[0].sites[0].id)
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 site.domain:', result[0].sites[0].domain)
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 site.status:', result[0].sites[0].status)
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 site.created_at:', result[0].sites[0].created_at)
    } else {
      console.log('👥🌐 [fetchAllUsersWithSites] ✅ 🌐 У первого пользователя НЕТ сайтов')
    }
    
    // Статистика по всем пользователям
    const usersWithSites = result.filter(u => u.sites && u.sites.length > 0)
    const totalSites = result.reduce((sum, u) => sum + (u.sites_count || 0), 0)
    console.log('👥🌐 [fetchAllUsersWithSites] 📊 СТАТИСТИКА:')
    console.log('👥🌐 [fetchAllUsersWithSites] 📊 Пользователей с сайтами:', usersWithSites.length)
    console.log('👥🌐 [fetchAllUsersWithSites] 📊 Всего сайтов в системе:', totalSites)
  }

  return result
}

/**
 * Получает пользователя по ID
 * Требует роль super_admin
 * GET /api/user/admin/users/{user_id}
 * 
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Object>} Данные пользователя
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function fetchUserById(userId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [fetchUserById] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [fetchUserById] → Запрос к:', `${API_URL}/user/admin/users/${userId}`)

  const response = await fetch(`${API_URL}/user/admin/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('👥 [fetchUserById] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('👥 [fetchUserById] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error('Пользователь не найден.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [fetchUserById] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Создает нового пользователя (Админ)
 * Требует роль super_admin
 * POST /api/user/admin/users
 * 
 * @param {Object} userData - Данные нового пользователя
 * @param {string} userData.user_name - Имя пользователя (обязательно)
 * @param {string} userData.email - Email (обязательно)
 * @param {string} userData.password - Пароль (обязательно)
 * @param {string} [userData.role] - Роль (опционально, по умолчанию "user")
 * @param {number|null} [userData.partner_id] - ID партнера (опционально)
 * @returns {Promise<Object>} Созданный пользователь
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function createUser(userData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [createUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [createUser] → Создание пользователя')
  console.log('👥 [createUser] → Данные:', userData)

  const response = await fetch(`${API_URL}/user/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  console.log('👥 [createUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('👥 [createUser] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 400) {
      throw new Error(errorData.detail || 'Некорректные данные.')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [createUser] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Обновляет данные пользователя (Админ)
 * Требует роль super_admin
 * PUT /api/user/admin/users/{user_id}
 * 
 * @param {number|string} userId - ID пользователя
 * @param {Object} userData - Данные для обновления (все поля опциональны)
 * @param {string} [userData.user_name] - Новое имя пользователя
 * @param {string} [userData.email] - Новый email
 * @param {string} [userData.password] - Новый пароль
 * @param {string} [userData.role] - Новая роль
 * @param {number|null} [userData.partner_id] - Новый partner_id
 * @returns {Promise<Object>} Обновленные данные пользователя
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function updateUser(userId, userData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [updateUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [updateUser] → Обновление пользователя:', userId)
  console.log('👥 [updateUser] → Данные для обновления:', userData)

  const response = await fetch(`${API_URL}/user/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  console.log('👥 [updateUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('👥 [updateUser] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error('Пользователь не найден.')
    }
    if (response.status === 400) {
      throw new Error(errorData.detail || 'Некорректные данные.')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [updateUser] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Удаляет пользователя (Админ)
 * Требует роль super_admin
 * DELETE /api/user/admin/users/{user_id}
 * 
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Object>} Результат удаления
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function deleteUser(userId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [deleteUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [deleteUser] → Удаление пользователя:', userId)

  const response = await fetch(`${API_URL}/user/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('👥 [deleteUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('👥 [deleteUser] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error('Пользователь не найден.')
    }
    if (response.status === 400) {
      throw new Error(errorData.detail || 'Нельзя удалить этого пользователя.')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [deleteUser] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Изменяет роль пользователя
 * Требует роль super_admin
 * PUT /api/user/role/{user_id}
 * 
 * @param {number|string} userId - ID пользователя
 * @param {string} role - Новая роль
 * @returns {Promise<Object>} Обновленный пользователь
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function updateUserRole(userId, role) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [updateUserRole] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [updateUserRole] → Изменение роли пользователя:', userId, 'на:', role)

  const response = await fetch(`${API_URL}/user/role/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ role }),
  })

  console.log('👥 [updateUserRole] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('👥 [updateUserRole] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error('Пользователь не найден.')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [updateUserRole] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Изменяет партнера пользователя
 * Требует роль super_admin
 * PUT /api/user/partner/{user_id}
 * 
 * @param {number|string} userId - ID пользователя
 * @param {number|null} partnerId - ID партнера или null
 * @returns {Promise<Object>} Обновленный пользователь
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function updateUserPartner(userId, partnerId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('👥 [updateUserPartner] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('👥 [updateUserPartner] → Изменение партнера пользователя:', userId, 'на:', partnerId)

  const response = await fetch(`${API_URL}/user/partner/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ partner_id: partnerId }),
  })

  console.log('👥 [updateUserPartner] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('👥 [updateUserPartner] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error('Пользователь или партнер не найден.')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('👥 [updateUserPartner] ✅ Ответ от бэкенда:', data)
  return data
}

