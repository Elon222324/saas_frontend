/**
 * Компонент заголовка страницы управления пользователями
 * Содержит поиск, фильтры и кнопку создания
 */
export default function UsersHeader({ 
  searchQuery, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  onCreateClick,
  totalUsers,
  totalSitesCount,
  usersWithSitesCount
}) {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">Управление пользователями</h1>
            <p className="text-gray-600 mt-1">
              Управление всеми пользователями системы (только для super_admin)
            </p>
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Создать пользователя
          </button>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Поиск */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Поиск по имени, email или ID..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Фильтр по роли */}
          <div className="w-full md:w-64">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Все роли</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Пользователей:</span>
            <span className="font-semibold ml-1 text-purple-700">{totalUsers}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span>Всего сайтов:</span>
            <span className="font-semibold ml-1 text-blue-700">{totalSitesCount || 0}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>С сайтами:</span>
            <span className="font-semibold ml-1 text-green-700">{usersWithSitesCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

