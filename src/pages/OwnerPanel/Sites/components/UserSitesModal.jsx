import { useState, useEffect } from 'react'
import { getUserSites, deleteSiteFromUser, getSiteById } from '../api/sites'
import { ExternalLink, Settings, Trash2, RefreshCw } from 'lucide-react'
import AddSiteModal from './AddSiteModal'

/**
 * Модальное окно для просмотра и управления сайтами пользователя
 * 
 * @param {Object} props
 * @param {Object} props.user - Объект пользователя
 * @param {number} props.user.id - ID пользователя
 * @param {string} props.user.email - Email пользователя
 * @param {string} props.user.user_name - Имя пользователя
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {Function} [props.onUpdate] - Функция вызываемая при обновлении списка сайтов
 */
export default function UserSitesModal({ user, onClose, onUpdate }) {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  useEffect(() => {
    if (user?.id) {
      loadSites()
    }
  }, [user?.id])

  async function loadSites() {
    try {
      console.log('🌐 [UserSitesModal] Загрузка сайтов пользователя:', user.id)
      setLoading(true)
      setError(null)
      
      const data = await getUserSites(user.id)
      console.log('🌐 [UserSitesModal] Получены сайты:', data)
      
      setSites(data.sites || [])
    } catch (err) {
      console.error('🌐 [UserSitesModal] Ошибка загрузки сайтов:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSite = async (siteId, domain) => {
    if (!window.confirm(
      `⚠️ ВНИМАНИЕ! Вы уверены, что хотите ПОЛНОСТЬЮ УДАЛИТЬ сайт "${domain}"?\n\n` +
      `Это необратимая операция! Будет удалено:\n` +
      `• Docker контейнер (остановлен и удален)\n` +
      `• Все файлы и директории сайта\n` +
      `• База данных PostgreSQL сайта\n` +
      `• Запись из базы данных SaaS\n` +
      `• Кэш фронтенда\n\n` +
      `Все данные сайта будут потеряны без возможности восстановления!\n\n` +
      `Процесс займет 10-30 секунд.`
    )) {
      return
    }

    try {
      setDeletingId(siteId)
      console.log('🌐 [UserSitesModal] Полное удаление сайта:', siteId)
      console.log('🌐 [UserSitesModal] Это займет 10-30 секунд...')
      
      await deleteSiteFromUser(user.id, siteId)
      console.log('🌐 [UserSitesModal] Сайт полностью удален (контейнер + файлы + БД)')
      
      // Обновляем список сайтов
      await loadSites()
      
      // Вызываем callback если передан
      if (onUpdate) {
        onUpdate()
      }
      
      // Показываем сообщение об успехе
      alert(`✅ Сайт "${domain}" успешно удален.\n\nУдалено:\n• Контейнер Docker\n• Все файлы сайта\n• База данных PostgreSQL\n• Запись из БД`)
    } catch (err) {
      console.error('🌐 [UserSitesModal] Ошибка удаления сайта:', err)
      alert(`❌ Ошибка при удалении сайта: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddSite = (newSite) => {
    console.log('🌐 [UserSitesModal] Сайт добавлен:', newSite)
    // Перезагружаем список сайтов
    loadSites()
    
    // Вызываем callback если передан
    if (onUpdate) {
      onUpdate()
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'running':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">🟢 Запущен</span>
      case 'deploying':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⚡ Деплой</span>
      case 'stopped':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">🔴 Остановлен</span>
      case 'created':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">🔵 Создан</span>
      case 'not_found':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">⚠️ Не найден</span>
      case 'error':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">❌ Ошибка</span>
      case 'unknown':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">❓ Неизвестно</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">{status}</span>
    }
  }

  if (!user) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Сайты пользователя</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {user.email} {user.user_name && `(${user.user_name})`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить сайт
              </button>
              <button
                onClick={loadSites}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Обновить
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-red-800 text-sm font-medium">Ошибка загрузки сайтов</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Загрузка сайтов...</p>
              </div>
            ) : sites.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <p className="mt-4 text-gray-600 font-medium">У пользователя нет сайтов</p>
                <p className="mt-1 text-sm text-gray-500">Нажмите "Добавить сайт" чтобы создать первый сайт</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                  Всего сайтов: <span className="font-semibold text-gray-900">{sites.length}</span>
                </div>

                {sites.map(site => (
                  <div 
                    key={site.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Домен и статус */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {site.domain}
                          </h3>
                          {getStatusBadge(site.status)}
                        </div>

                        {/* Информация */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">ID сайта:</span>
                            <span className="ml-2 font-medium text-gray-900">{site.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">API Key ID:</span>
                            <span className="ml-2 font-medium text-gray-900">{site.api_key_id}</span>
                          </div>
                          {site.name && (
                            <div>
                              <span className="text-gray-500">Имя контейнера:</span>
                              <span className="ml-2 font-medium text-gray-900">{site.name}</span>
                            </div>
                          )}
                          {site.path && (
                            <div>
                              <span className="text-gray-500">Путь:</span>
                              <span className="ml-2 font-mono text-xs text-gray-900">{site.path}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Создан:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {site.created_at ? new Date(site.created_at).toLocaleString('ru-RU') : '-'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => window.open(`https://${site.domain}${baseDomain ? `.${baseDomain}` : ''}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Открыть сайт"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/settings/${site.domain}/pages`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Настройки сайта"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSite(site.id, site.domain)}
                          disabled={deletingId === site.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Удалить сайт из БД"
                        >
                          {deletingId === site.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Информационное сообщение */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">⚠️ Важная информация:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Удаление выполняет полную очистку:</strong> контейнер + файлы + база данных</li>
                    <li><strong>Операция необратима</strong> - все данные сайта будут потеряны</li>
                    <li>Процесс удаления занимает 10-30 секунд</li>
                    <li>Статусы получаются в реальном времени через Docker API</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно добавления сайта */}
      {showAddModal && (
        <AddSiteModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleAddSite}
          preselectedUserId={user.id}
        />
      )}
    </>
  )
}

