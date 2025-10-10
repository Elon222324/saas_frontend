import { useState, useEffect } from 'react'
import { fetchAllUsers } from './api/users'

export default function OwnerUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUsers() {
      try {
        console.log('👥 [OwnerUsers] Начало загрузки пользователей...')
        setLoading(true)
        setError(null)
        const data = await fetchAllUsers()
        console.log('👥 [OwnerUsers] Пользователи успешно загружены:', data)
        console.log('👥 [OwnerUsers] Количество пользователей:', data.length)
        setUsers(data)
      } catch (err) {
        console.error('👥 [OwnerUsers] ❌ Ошибка загрузки пользователей:', err)
        console.error('👥 [OwnerUsers] ❌ Сообщение ошибки:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
        console.log('👥 [OwnerUsers] Загрузка завершена')
      }
    }

    loadUsers()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Пользователи</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Пользователи</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-red-600">Ошибка: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Пользователи</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <p className="text-gray-600 mb-4">Список всех пользователей системы (только для super_admin)</p>
        
        {users.length === 0 ? (
          <p className="text-gray-500">Нет пользователей</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя пользователя</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.user_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.role === 'super_admin' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Super Admin
                        </span>
                      ) : user.role === 'admin' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.partner_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.is_active !== false ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Активен
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Неактивен
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
