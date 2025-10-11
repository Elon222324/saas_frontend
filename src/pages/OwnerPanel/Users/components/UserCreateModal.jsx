import { useState } from 'react'
import { createUser } from '../api/users'

/**
 * Модальное окно для создания нового пользователя
 */
export default function UserCreateModal({ onClose, onCreate }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    role: 'user',
    partner_id: null,
  })

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
      // Подготовка данных для отправки
      const userData = {
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }

      // Добавляем partner_id только если он указан
      if (formData.partner_id !== null && formData.partner_id !== '') {
        userData.partner_id = formData.partner_id
      }

      const newUser = await createUser(userData)
      onCreate(newUser)
      onClose()
    } catch (err) {
      console.error('Ошибка создания пользователя:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Создать нового пользователя</h2>
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Введите имя пользователя"
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
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введите пароль"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Пароль будет автоматически захеширован</p>
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
                <option value="user">User (обычный пользователь)</option>
                <option value="admin">Admin (администратор)</option>
                <option value="super_admin">Super Admin (супер-администратор)</option>
                <option value="partner">Partner (партнер)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">По умолчанию: User</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner ID (опционально)
              </label>
              <input
                type="number"
                name="partner_id"
                value={formData.partner_id || ''}
                onChange={handleChange}
                placeholder="Оставьте пустым для null"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Укажите ID партнера, если требуется</p>
            </div>

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
                className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Создание...' : 'Создать пользователя'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

