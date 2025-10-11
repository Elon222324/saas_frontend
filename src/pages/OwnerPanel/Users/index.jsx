import { useState, useEffect } from 'react'
import { fetchAllUsersWithSites } from './api/users'
import UsersHeader from './components/UsersHeader'
import UsersList from './components/UsersList'
import UserDetailsModal from './components/UserDetailsModal'
import UserCreateModal from './components/UserCreateModal'

/**
 * Главная страница управления пользователями в Owner Panel
 * Требует роль super_admin
 */
export default function OwnerUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Состояния для фильтрации и поиска
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  
  // Состояния для модальных окон
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      console.log('👥🌐 [OwnerUsers] Начало загрузки пользователей с информацией о сайтах...')
      setLoading(true)
      setError(null)
      const data = await fetchAllUsersWithSites()
      console.log('👥🌐 [OwnerUsers] Пользователи успешно загружены:', data)
      console.log('👥🌐 [OwnerUsers] Количество пользователей:', data.length)
      setUsers(data)
    } catch (err) {
      console.error('👥🌐 [OwnerUsers] ❌ Ошибка загрузки пользователей:', err)
      console.error('👥🌐 [OwnerUsers] ❌ Сообщение ошибки:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
      console.log('👥🌐 [OwnerUsers] Загрузка завершена')
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedUser(null)
  }

  const handleUserUpdate = (updatedUser) => {
    if (updatedUser === null) {
      // Пользователь был удален
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
    } else {
      // Пользователь был обновлен
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
      setSelectedUser(updatedUser)
    }
  }

  const handleCreateClick = () => {
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
  }

  const handleUserCreate = (newUser) => {
    setUsers(prev => [...prev, newUser])
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Загрузка пользователей...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Ошибка загрузки</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  // Вычисляемые значения для статистики
  const totalSitesCount = users.reduce((sum, user) => sum + (user.sites_count || 0), 0)
  const usersWithSitesCount = users.filter(user => (user.sites_count || 0) > 0).length

  return (
    <div className="p-6">
      <UsersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onCreateClick={handleCreateClick}
        totalUsers={users.length}
        totalSitesCount={totalSitesCount}
        usersWithSitesCount={usersWithSitesCount}
      />

      <UsersList
        users={users}
        onUserClick={handleUserClick}
        searchQuery={searchQuery}
        roleFilter={roleFilter}
      />

      {/* Модальные окна */}
      {showDetailsModal && (
        <UserDetailsModal
          user={selectedUser}
          onClose={handleCloseDetailsModal}
          onUpdate={handleUserUpdate}
        />
      )}

      {showCreateModal && (
        <UserCreateModal
          onClose={handleCloseCreateModal}
          onCreate={handleUserCreate}
        />
      )}
    </div>
  )
}
