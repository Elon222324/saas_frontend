/**
 * API модуль для работы с сайтами системы (Owner Panel)
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
 * Получает список всех сайтов системы
 * Требует роль super_admin
 * 
 * @returns {Promise<Array>} Массив сайтов
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function fetchAllSites() {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [fetchAllSites] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [fetchAllSites] → Запрос к:', `${API_URL}/sites/get_all_admin/`)
  console.log('🌐 [fetchAllSites] → Токен присутствует:', accessToken ? 'Да' : 'Нет')

  const response = await fetch(`${API_URL}/sites/get_all_admin/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-cache',
  })

  console.log('🌐 [fetchAllSites] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🌐 [fetchAllSites] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [fetchAllSites] ← Сырые данные от бэкенда:', data)
  console.log('🌐 [fetchAllSites] ← Тип данных:', Array.isArray(data) ? 'Array' : typeof data)
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    console.log('🌐 [fetchAllSites] ← Ключи объекта:', Object.keys(data))
  }

  const result = Array.isArray(data) ? data : (data?.sites || data?.results || data?.data || [])
  console.log('🌐 [fetchAllSites] ✅ Обработанные данные:', result)
  console.log('🌐 [fetchAllSites] ✅ Количество сайтов:', result.length)
  
  if (result.length > 0) {
    console.log('🌐 [fetchAllSites] ✅ Пример первого сайта:', result[0])
    console.log('🌐 [fetchAllSites] ✅ Структура первого сайта - ключи:', Object.keys(result[0]))
  }

  return result
}

/**
 * Обновляет данные сайта
 * Требует роль super_admin
 * 
 * @param {number|string} siteId - ID сайта
 * @param {Object} siteData - Данные для обновления
 * @returns {Promise<Object>} Обновленные данные сайта
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function updateSite(siteId, siteData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [updateSite] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [updateSite] → Обновление сайта:', siteId)
  console.log('🌐 [updateSite] → Данные для обновления:', siteData)

  const response = await fetch(`${API_URL}/sites/${siteId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(siteData),
  })

  console.log('🌐 [updateSite] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🌐 [updateSite] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [updateSite] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Удаляет сайт
 * Требует роль super_admin
 * 
 * @param {number|string} siteId - ID сайта
 * @returns {Promise<Object>} Результат удаления
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function deleteSite(siteId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [deleteSite] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [deleteSite] → Удаление сайта:', siteId)

  const response = await fetch(`${API_URL}/sites/${siteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('🌐 [deleteSite] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🌐 [deleteSite] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [deleteSite] ✅ Ответ от бэкенда:', data)
  return data
}

/**
 * Создает новый сайт
 * Требует роль super_admin
 * 
 * @param {Object} siteData - Данные нового сайта
 * @returns {Promise<Object>} Созданный сайт
 * @throws {Error} При ошибке авторизации или доступа
 */
export async function createSite(siteData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [createSite] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [createSite] → Создание сайта')
  console.log('🌐 [createSite] → Данные:', siteData)

  const response = await fetch(`${API_URL}/sites/add_new`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(siteData),
  })

  console.log('🌐 [createSite] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    console.error('🌐 [createSite] ❌ Ошибка HTTP:', response.status)
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [createSite] ✅ Ответ от бэкенда:', data)
  return data
}

// ==========================================
// API функции для управления сайтами пользователей
// Основаны на документации ADMIN_SITES_API_DOCUMENTATION.md
// ==========================================

/**
 * Добавить сайт пользователю с полным автоматическим деплоем
 * POST /api/user/admin/users/{user_id}/sites
 * 
 * Что происходит при создании:
 * 1. ✅ Создание записи в базе данных
 * 2. ✅ Создание директорий и файлов сайта
 * 3. ✅ Создание базы данных PostgreSQL для сайта
 * 4. ✅ Инициализация всех таблиц сайта
 * 5. ✅ Создание и запуск Docker контейнера
 * 6. ✅ Сайт автоматически становится доступен
 * 
 * @param {number} userId - ID пользователя
 * @param {Object} siteData - Данные сайта
 * @param {number} siteData.user_id - ID пользователя (должен совпадать с userId)
 * @param {string} siteData.domain - Домен сайта (уникальный)
 * @returns {Promise<Object>} Созданный сайт с информацией о владельце и статусом "running"
 * @throws {Error} При ошибке авторизации, доступа или валидации
 * 
 * @note Процесс деплоя может занять 30-60 секунд
 * @note API ключи больше не требуются - создаются автоматически
 */
export async function addSiteToUser(userId, siteData) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [addSiteToUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [addSiteToUser] → Добавление сайта пользователю:', userId)
  console.log('🌐 [addSiteToUser] → Данные сайта:', siteData)
  console.log('🌐 [addSiteToUser] → Будет выполнен полный автоматический деплой (30-60 секунд)')

  const response = await fetch(`${API_URL}/user/admin/users/${userId}/sites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(siteData),
  })

  console.log('🌐 [addSiteToUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    let errorData = {}
    let errorText = ''
    
    try {
      errorText = await response.text()
      console.log('🌐 [addSiteToUser] ← Текст ответа:', errorText)
      
      if (errorText) {
        errorData = JSON.parse(errorText)
        console.log('🌐 [addSiteToUser] ← Распарсенный JSON:', errorData)
      }
    } catch (parseError) {
      console.error('🌐 [addSiteToUser] ← Не удалось распарсить ответ:', parseError)
      console.log('🌐 [addSiteToUser] ← Сырой текст ошибки:', errorText)
    }
    
    console.error('🌐 [addSiteToUser] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 400) {
      throw new Error(errorData.detail || errorData.message || 'Неверные данные запроса')
    }
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error(errorData.detail || errorData.message || 'Пользователь не найден')
    }
    if (response.status === 500) {
      throw new Error(errorData.detail || errorData.message || 'Ошибка сервера при создании сайта')
    }
    throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [addSiteToUser] ✅ Сайт успешно создан и задеплоен:', data)
  console.log('🌐 [addSiteToUser] ✅ Статус:', data.status)
  return data
}

/**
 * Получить все сайты конкретного пользователя
 * GET /api/user/admin/users/{user_id}/sites
 * 
 * @param {number} userId - ID пользователя
 * @returns {Promise<Object>} Объект с информацией о сайтах пользователя
 * @returns {number} return.user_id - ID пользователя
 * @returns {number} return.sites_count - Количество сайтов
 * @returns {Array<Object>} return.sites - Массив сайтов с текущими статусами
 * @throws {Error} При ошибке авторизации, доступа или если пользователь не найден
 */
export async function getUserSites(userId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [getUserSites] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [getUserSites] → Запрос сайтов пользователя:', userId)

  const response = await fetch(`${API_URL}/user/admin/users/${userId}/sites`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-cache',
  })

  console.log('🌐 [getUserSites] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('🌐 [getUserSites] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error(errorData.detail || 'Пользователь не найден')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [getUserSites] ✅ Данные получены:', data)
  console.log('🌐 [getUserSites] ✅ Количество сайтов:', data.sites_count)
  return data
}

/**
 * Получить информацию о сайте по ID
 * GET /api/user/admin/sites/{site_id}
 * 
 * @param {number} siteId - ID сайта
 * @returns {Promise<Object>} Информация о сайте с данными владельца
 * @throws {Error} При ошибке авторизации, доступа или если сайт не найден
 */
export async function getSiteById(siteId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [getSiteById] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [getSiteById] → Запрос информации о сайте:', siteId)

  const response = await fetch(`${API_URL}/user/admin/sites/${siteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-cache',
  })

  console.log('🌐 [getSiteById] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('🌐 [getSiteById] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error(errorData.detail || 'Сайт не найден')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [getSiteById] ✅ Данные о сайте получены:', data)
  return data
}

/**
 * Полностью удалить сайт пользователя со всей инфраструктурой
 * DELETE /api/user/admin/users/{user_id}/sites/{site_id}
 * 
 * ⚠️ ВНИМАНИЕ: Это необратимая операция! Все данные сайта будут удалены без возможности восстановления.
 * 
 * Что происходит при удалении:
 * 1. ✅ Остановка Docker контейнера
 * 2. ✅ Удаление контейнера
 * 3. ✅ Удаление записи из базы данных SaaS
 * 4. ✅ Удаление всех файлов и директорий сайта
 * 5. ✅ Удаление базы данных PostgreSQL сайта
 * 6. ✅ Очистка кэша фронтенда
 * 
 * @param {number} userId - ID пользователя (для проверки владения)
 * @param {number} siteId - ID сайта для удаления
 * @returns {Promise<Object>} Результат удаления
 * @returns {boolean} return.success - Статус операции
 * @returns {string} return.message - Сообщение об успешном удалении
 * @returns {number} return.deleted_site_id - ID удаленного сайта
 * @returns {number} return.user_id - ID владельца
 * @throws {Error} При ошибке авторизации, доступа, валидации или если сайт не найден
 * 
 * @note Процесс удаления занимает 10-30 секунд
 * @note Операция необратима - все данные будут потеряны
 */
export async function deleteSiteFromUser(userId, siteId) {
  const accessToken = getAccessToken()
  
  if (!accessToken) {
    console.error('🌐 [deleteSiteFromUser] Ошибка: отсутствует access_token')
    throw new Error('Отсутствует access_token пользователя')
  }

  console.log('🌐 [deleteSiteFromUser] → Полное удаление сайта:', siteId, 'у пользователя:', userId)
  console.log('🌐 [deleteSiteFromUser] → Будет удалено: контейнер + файлы + БД (10-30 секунд)')

  const response = await fetch(`${API_URL}/user/admin/users/${userId}/sites/${siteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  console.log('🌐 [deleteSiteFromUser] ← Статус ответа:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('🌐 [deleteSiteFromUser] ❌ Ошибка HTTP:', response.status, errorData)
    
    if (response.status === 400) {
      throw new Error(errorData.detail || 'Сайт не принадлежит указанному пользователю')
    }
    if (response.status === 401) {
      throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
    }
    if (response.status === 403) {
      throw new Error('Доступ запрещен. Требуется роль super_admin.')
    }
    if (response.status === 404) {
      throw new Error(errorData.detail || 'Сайт не найден')
    }
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [deleteSiteFromUser] ✅ Сайт полностью удален:', data)
  return data
}

