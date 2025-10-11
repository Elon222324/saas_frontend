import { useState, useEffect } from 'react'
import { updateUser, deleteUser } from '../api/users'

/**
 * Модальное окно с деталями и редактированием пользователя
 */
export default function UserDetailsModal({ user, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    role: 'user',
    partner_id: null,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        user_name: user.user_name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        partner_id: user.partner_id || null,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'partner_id' ? (value === '' ? null : parseInt(value)) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Формируем данные для обновления (только измененные поля)
      const updates = {}
      if (formData.user_name !== user.user_name) updates.user_name = formData.user_name
      if (formData.email !== user.email) updates.email = formData.email
      if (formData.password) updates.password = formData.password
      if (formData.role !== user.role) updates.role = formData.role
      if (formData.partner_id !== user.partner_id) updates.partner_id = formData.partner_id

      if (Object.keys(updates).length === 0) {
        setIsEditing(false)
        return
      }

      const updatedUser = await updateUser(user.id, updates)
      onUpdate(updatedUser)
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка обновления пользователя:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить пользователя "${user.email}"?\n\n⚠️ ВНИМАНИЕ: Также будут удалены все связанные данные (API ключи, сайты).`)) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await deleteUser(user.id)
      onUpdate(null) // null означает, что пользователь был удален
      onClose()
    } catch (err) {
      console.error('Ошибка удаления пользователя:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Редактирование пользователя' : 'Детали пользователя'}
          </h2>
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
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID пользователя
                </label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя пользователя *
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Новый пароль
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Оставьте пустым, чтобы не менять"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Оставьте поле пустым, если не хотите менять пароль</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Роль *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner ID
                </label>
                <input
                  type="number"
                  name="partner_id"
                  value={formData.partner_id || ''}
                  onChange={handleChange}
                  placeholder="Оставьте пустым или 0 для null"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="text-base text-gray-900">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Имя пользователя</p>
                  <p className="text-base text-gray-900">{user.user_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Роль</p>
                  <div className="mt-1">
                    {user.role === 'super_admin' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Super Admin
                      </span>
                    ) : user.role === 'admin' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    ) : user.role === 'partner' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Partner
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Partner ID</p>
                  <p className="text-base text-gray-900">{user.partner_id || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Дата создания</p>
                  <p className="text-base text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleString('ru-RU') : '-'}
                  </p>
                </div>
              </div>

              {/* Секция с сайтами пользователя */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Сайты пользователя
                  {user.sites_count > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.sites_count}
                    </span>
                  )}
                </p>
                {user.sites && user.sites.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {user.sites.map((site, index) => (
                      <div 
                        key={site.id || index} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                        onClick={() => {
                          if (site.domain) {
                            console.log('🌐 [UserDetailsModal] Переход к настройкам сайта:', site.domain)
                            window.location.href = `/settings/${site.domain}/pages`
                          }
                        }}
                        title={site.domain ? `Открыть настройки сайта ${site.domain}` : 'Домен не указан'}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                              {site.domain || 'Без домена'}
                            </p>
                            {site.status && (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                site.status === 'running' 
                                  ? 'bg-green-100 text-green-800' 
                                  : site.status === 'stopped'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {site.status === 'running' ? '🟢 Запущен' : site.status === 'stopped' ? '🔴 Остановлен' : site.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span>ID: {site.id}</span>
                            {site.created_at && (
                              <span>
                                Создан: {new Date(site.created_at).toLocaleDateString('ru-RU')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">У пользователя нет сайтов</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Удаление...' : 'Удалить пользователя'}
                </button>
                <div className="space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

