import { useState, useEffect } from 'react'
import { fetchAllSites } from './api/sites'
import { Button } from '@/components/ui/button'
import { Settings, ExternalLink, Users, Plus } from 'lucide-react'
import AddSiteModal from './components/AddSiteModal'
import UserSitesModal from './components/UserSitesModal'

export default function OwnerSites() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedUserForSites, setSelectedUserForSites] = useState(null)

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  useEffect(() => {
    loadSites()
  }, [])

  async function loadSites() {
    try {
      console.log('🌐 [OwnerSites] Начало загрузки сайтов...')
      setLoading(true)
      setError(null)
      const data = await fetchAllSites()
      console.log('🌐 [OwnerSites] Сайты успешно загружены:', data)
      console.log('🌐 [OwnerSites] Количество сайтов:', data.length)
      setSites(data)
    } catch (err) {
      console.error('🌐 [OwnerSites] ❌ Ошибка загрузки сайтов:', err)
      console.error('🌐 [OwnerSites] ❌ Сообщение ошибки:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
      console.log('🌐 [OwnerSites] Загрузка завершена')
    }
  }

  const handleSiteCreated = (newSite) => {
    console.log('🌐 [OwnerSites] Новый сайт создан:', newSite)
    // Перезагружаем список всех сайтов
    loadSites()
  }

  const handleViewUserSites = (userId) => {
    console.log('🌐 [OwnerSites] Просмотр сайтов пользователя:', userId)
    // Находим информацию о пользователе из текущих сайтов
    const site = sites.find(s => s.user_id === userId)
    if (site) {
      setSelectedUserForSites({
        id: userId,
        email: site.owner_email || 'Unknown',
        user_name: site.owner_name || 'Unknown'
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Все сайты</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Все сайты</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-red-600">Ошибка: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header с кнопками действий */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-purple-600">Все сайты</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить сайт пользователю
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <p className="text-gray-600 mb-4">
          Список всех сайтов в системе (только для super_admin)
          {sites.length > 0 && (
            <span className="ml-2 font-semibold text-purple-600">
              • Всего: {sites.length}
            </span>
          )}
        </p>
        
        {sites.length === 0 ? (
          <p className="text-gray-500">Нет сайтов</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Владелец</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email владельца</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Домен</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Путь</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Создан</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {site.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>ID: {site.user_id || '-'}</span>
                        {site.user_id && (
                          <button
                            onClick={() => handleViewUserSites(site.user_id)}
                            className="text-purple-600 hover:text-purple-800 transition-colors"
                            title="Просмотреть все сайты пользователя"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {site.owner_email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {site.domain ? (
                        <a
                          href={`https://${site.domain}.${baseDomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {site.domain}.{baseDomain}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.path || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {site.status === 'running' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Запущен
                        </span>
                      ) : site.status === 'stopped' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Остановлен
                        </span>
                      ) : site.status === 'not_found' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Не найден
                        </span>
                      ) : site.status === 'error' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                          Ошибка
                        </span>
                      ) : site.status === 'unknown' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Неизвестно
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                          {site.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.created_at ? new Date(site.created_at).toLocaleDateString('ru-RU') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Открыть сайт"
                          onClick={() => window.open(`https://${site.domain}.${baseDomain}`, '_blank')}
                          className="h-8 px-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Настройки сайта"
                          onClick={() => window.location.href = `/settings/${site.domain}/pages`}
                          className="h-8 px-2 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      {showAddModal && (
        <AddSiteModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleSiteCreated}
        />
      )}

      {selectedUserForSites && (
        <UserSitesModal
          user={selectedUserForSites}
          onClose={() => setSelectedUserForSites(null)}
          onUpdate={loadSites}
        />
      )}
    </div>
  )
}
