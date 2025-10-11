import { useState, useEffect } from 'react'
import { addSiteToUser } from '../api/sites'
import { fetchAllUsersWithSites } from '../../Users/api/users'

/**
 * Модальное окно для добавления сайта пользователю
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {Function} props.onCreate - Функция вызываемая после создания сайта
 * @param {number} [props.preselectedUserId] - Предварительно выбранный ID пользователя
 */
export default function AddSiteModal({ onClose, onCreate, preselectedUserId = null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  
  const [formData, setFormData] = useState({
    user_id: preselectedUserId || '',
    domain: '',
  })

  // Загрузка списка пользователей
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoadingUsers(true)
        const data = await fetchAllUsersWithSites()
        setUsers(data)
        
        // Если пользователь предварительно выбран, устанавливаем его
        if (preselectedUserId) {
          setFormData(prev => ({ ...prev, user_id: preselectedUserId }))
        }
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err)
        setError('Не удалось загрузить список пользователей')
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [preselectedUserId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'user_id' ? (value === '' ? '' : parseInt(value)) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Валидация
      if (!formData.user_id) {
        throw new Error('Выберите пользователя')
      }
      if (!formData.domain || formData.domain.trim() === '') {
        throw new Error('Введите домен сайта')
      }

      // Подготовка данных для отправки
      const siteData = {
        user_id: formData.user_id,
        domain: formData.domain.trim(),
      }

      console.log('🌐 [AddSiteModal] Отправка данных:', siteData)
      console.log('🌐 [AddSiteModal] Будет выполнен полный автоматический деплой (30-60 секунд)')

      const newSite = await addSiteToUser(formData.user_id, siteData)
      console.log('🌐 [AddSiteModal] Сайт успешно создан и задеплоен:', newSite)

      // Вызываем callback
      onCreate(newSite)
      
      // Закрываем модальное окно
      onClose()
    } catch (err) {
      console.error('🌐 [AddSiteModal] Ошибка создания сайта:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Получаем выбранного пользователя для отображения информации
  const selectedUser = users.find(u => u.id === formData.user_id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Добавить сайт пользователю</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loadingUsers ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600">Загрузка пользователей...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Выбор пользователя */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пользователь *
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  disabled={preselectedUserId !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Выберите пользователя</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email} - {user.user_name || 'Без имени'} (ID: {user.id})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Выберите пользователя, которому будет добавлен сайт
                </p>
              </div>

              {/* Информация о выбранном пользователе */}
              {selectedUser && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">Информация о пользователе:</p>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Имя:</span> {selectedUser.user_name || '-'}</p>
                    <p><span className="font-medium">Роль:</span> {selectedUser.role}</p>
                    <p><span className="font-medium">Текущее количество сайтов:</span> {selectedUser.sites_count || 0}</p>
                  </div>
                </div>
              )}

              {/* Домен */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Домен сайта *
                </label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  placeholder="example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Домен должен быть уникальным в системе
                </p>
              </div>

              {/* Информационный блок о процессе деплоя */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-2">Автоматический деплой сайта</p>
                    <p className="mb-2">При создании будет выполнено:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>✅ Создание записи в базе данных</li>
                      <li>✅ Создание директорий и файлов сайта</li>
                      <li>✅ Создание базы данных PostgreSQL</li>
                      <li>✅ Инициализация всех таблиц</li>
                      <li>✅ Создание и запуск Docker контейнера</li>
                      <li>✅ Сайт автоматически становится доступен</li>
                    </ul>
                    <p className="mt-2 text-xs text-green-700">
                      ⏱️ Процесс занимает 30-60 секунд. API ключи создаются автоматически.
                    </p>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Создание и деплой (30-60 сек)...' : 'Создать и задеплоить сайт'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

