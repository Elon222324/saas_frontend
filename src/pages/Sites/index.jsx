import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import PageLayout from '@/components/PageTemplate/PageLayout'
import PageHeaderTitle from '@/components/PageTemplate/PageHeaderTitle'
import {
  Pause,
  Play,
  RefreshCcw,
  Trash2,
  ExternalLink,
  Plus,
  Copy,
  Globe,
  Settings,
} from 'lucide-react'

export default function Sites() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)
  const [loadingSites, setLoadingSites] = useState({})

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  const setSiteLoading = (domain, value) => {
    setLoadingSites((prev) => ({ ...prev, [domain]: value }))
  }

  const isSiteLoading = (domain) => !!loadingSites[domain]

  const fetchSites = async () => {
    try {
      const res = await api.get('/sites/get_all/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      
      // Логируем все данные сайтов для отладки
      console.log('🔍 Получены данные сайтов:', res.data)
      
      // Логируем статусы каждого сайта
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach((site, index) => {
          console.log(`📊 Сайт ${index + 1} (${site.domain}):`, {
            id: site.id,
            name: site.name,
            domain: site.domain,
            status: site.status,
            statusType: typeof site.status,
            port: site.port,
            path: site.path
          })
        })
        
        // Подсчитываем количество сайтов по статусам
        const statusCounts = res.data.reduce((acc, site) => {
          acc[site.status] = (acc[site.status] || 0) + 1
          return acc
        }, {})
        console.log('📈 Статистика статусов:', statusCounts)
      }
      
      setSites(res.data)
    } catch (err) {
      console.error('Ошибка при получении сайтов:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSite = async () => {
    if (!newDomain.trim()) return

    console.log(`➕ Добавление нового сайта: ${newDomain.trim()}`)
    
    // Логирование данных отправки
    const token = localStorage.getItem('access_token')
    const requestData = { domain: newDomain.trim() }
    console.log(`📤 URL запроса: /sites/add_new`)
    console.log(`📤 Метод: POST`)
    console.log(`📤 Отправляемые данные:`, requestData)
    console.log(`📤 Токен присутствует:`, token ? 'Да' : 'Нет')
    console.log(`📤 Токен (первые 20 символов): ${token?.substring(0, 20)}...`)
    
    try {
      setAdding(true)
      const response = await api.post(
        '/sites/add_new',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(`✅ Сайт ${newDomain.trim()} успешно добавлен`)
      console.log(`✅ Ответ сервера:`, response.data)
      setNewDomain('')
      await fetchSites()
    } catch (err) {
      console.error(`❌ Ошибка при добавлении сайта ${newDomain.trim()}:`, err)
      
      let errorMessage = 'Ошибка при добавлении сайта'
      
      // Детальное логирование ошибки
      if (err.response) {
        console.error(`❌ Статус ошибки: ${err.response.status}`)
        console.error(`❌ Данные ошибки:`, err.response.data)
        console.error(`❌ Заголовки ответа:`, err.response.headers)
        
        // Проверяем структуру ошибки: { detail: { error, message } }
        if (err.response.data?.detail) {
          if (typeof err.response.data.detail === 'object') {
            // Вложенная структура
            if (err.response.data.detail.message) {
              errorMessage = err.response.data.detail.message
              console.error(`❌ Сообщение от сервера: ${err.response.data.detail.message}`)
            }
            if (err.response.data.detail.error) {
              console.error(`❌ Код ошибки: ${err.response.data.detail.error}`)
            }
          } else if (typeof err.response.data.detail === 'string') {
            // Простая строка
            errorMessage = err.response.data.detail
            console.error(`❌ Детали от сервера: ${err.response.data.detail}`)
          }
        }
        
        // Альтернативные поля
        if (!errorMessage || errorMessage === 'Ошибка при добавлении сайта') {
          if (err.response.data?.message) {
            errorMessage = err.response.data.message
            console.error(`❌ Сообщение от сервера: ${err.response.data.message}`)
          }
          if (err.response.data?.error) {
            errorMessage = err.response.data.error
            console.error(`❌ Ошибка от сервера: ${err.response.data.error}`)
          }
        }
      } else if (err.request) {
        console.error(`❌ Запрос был отправлен, но ответа не было:`, err.request)
        errorMessage = 'Нет ответа от сервера'
      } else {
        console.error(`❌ Ошибка при создании запроса:`, err.message)
        errorMessage = err.message
      }
      
      console.error(`❌ Весь объект ошибки:`, err)
      console.error(`❌ Итоговое сообщение для пользователя: ${errorMessage}`)
      
      // Показываем alert с сообщением об ошибке
      alert(`⚠️ ${errorMessage}`)
    } finally {
      setAdding(false)
    }
  }

  const handleStopSite = async (domain) => {
    if (isSiteLoading(domain)) return
    console.log(`🛑 Остановка сайта: ${domain}`)
    setSiteLoading(domain, true)
    try {
      await api.post('/sites/stop-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      console.log(`✅ Сайт ${domain} успешно остановлен`)
      await fetchSites()
    } catch (err) {
      console.error(`❌ Ошибка при остановке сайта ${domain}:`, err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleStartSite = async (domain) => {
    if (isSiteLoading(domain)) return
    console.log(`▶️ Запуск сайта: ${domain}`)
    setSiteLoading(domain, true)
    try {
      await api.post('/sites/start-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      console.log(`✅ Сайт ${domain} успешно запущен`)
      await fetchSites()
    } catch (err) {
      console.error(`❌ Ошибка при запуске сайта ${domain}:`, err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleRestartSite = async (domain) => {
    if (isSiteLoading(domain)) return
    console.log(`🔄 Перезапуск сайта: ${domain}`)
    setSiteLoading(domain, true)
    try {
      await api.post('/sites/restart-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      console.log(`✅ Сайт ${domain} успешно перезапущен`)
      await fetchSites()
    } catch (err) {
      console.error(`❌ Ошибка при перезапуске сайта ${domain}:`, err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleDeleteSite = async (domain) => {
    if (isSiteLoading(domain)) return
    console.log(`🗑️ Удаление сайта: ${domain}`)
    setSiteLoading(domain, true)
    try {
      await api.post('/sites/delete-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      console.log(`✅ Сайт ${domain} успешно удален`)
      await fetchSites()
    } catch (err) {
      console.error(`❌ Ошибка при удалении сайта ${domain}:`, err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleCopyLink = (domain) => {
    const fullLink = `https://${domain}.${baseDomain}`
    navigator.clipboard.writeText(fullLink)
    alert(`Скопировано: ${fullLink}`)
  }

  useEffect(() => {
    fetchSites()
  }, [])

  if (loading) return (
    <PageLayout
      backgroundGradient="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      containerClass="p-6 space-y-6 max-w-7xl mx-auto"
      gridHeight="auto"
      header={
        <PageHeaderTitle
          title="Сайты"
          subtitle="Управление вашими сайтами и доменами"
          icon={Globe}
          onRefresh={fetchSites}
        />
      }
      content={
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      }
    />
  )

  return (
    <PageLayout
      backgroundGradient="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      containerClass="p-6 space-y-6 max-w-7xl mx-auto"
      gridHeight="auto"
      header={
        <PageHeaderTitle
          title="Сайты"
          subtitle="Управление вашими сайтами и доменами"
          icon={Globe}
          onRefresh={fetchSites}
        />
      }
      content={
        <div className="space-y-6">
          {/* Добавление сайта */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex gap-2 items-center flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Введите домен (без .site)"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
                className="border border-gray-200 rounded-xl px-4 py-3 w-full sm:w-auto sm:flex-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Button
                onClick={handleAddSite}
                disabled={adding}
                className="flex gap-2 items-center w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus size={18} />
                {adding ? 'Добавление...' : 'Добавить'}
              </Button>
            </div>
          </div>

          {/* Список сайтов */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Заголовок */}
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-semibold text-gray-800 truncate">
                      {site.domain}.{baseDomain}
                    </h2>
                    <div className="flex gap-1">
                      <a
                        href={`https://${site.domain}.${baseDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Открыть сайт"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/80 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(site.domain)}
                        title="Скопировать ссылку"
                        className="h-8 w-8 hover:bg-white/80 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Контент */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">Статус:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        site.status === 'running' 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : site.status === 'stopped'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : site.status === 'not_found'
                          ? 'bg-orange-100 text-orange-700 border border-orange-300'
                          : site.status === 'error'
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : site.status === 'unknown'
                          ? 'bg-gray-100 text-gray-700 border border-gray-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {
                        site.status === 'running' 
                          ? 'Запущен' 
                          : site.status === 'stopped'
                          ? 'Остановлен'
                          : site.status === 'not_found'
                          ? 'Не найден'
                          : site.status === 'error'
                          ? 'Ошибка'
                          : site.status === 'unknown'
                          ? 'Неизвестно'
                          : site.status
                      }
                    </span>
                  </div>

                  {/* Кнопки управления */}
                  <div className="flex gap-2 flex-wrap">
                    {site.status === 'running' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Остановить"
                        onClick={() => handleStopSite(site.domain)}
                        disabled={isSiteLoading(site.domain)}
                        className={`h-9 w-9 rounded-lg transition-all ${
                          isSiteLoading(site.domain)
                            ? 'bg-orange-200 text-orange-400 cursor-not-allowed'
                            : 'bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 border border-orange-200'
                        }`}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Запустить"
                        onClick={() => handleStartSite(site.domain)}
                        disabled={isSiteLoading(site.domain)}
                        className={`h-9 w-9 rounded-lg transition-all ${
                          isSiteLoading(site.domain)
                            ? 'bg-green-200 text-green-400 cursor-not-allowed'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 border border-green-200'
                        }`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Перезапустить"
                      onClick={() => handleRestartSite(site.domain)}
                      disabled={isSiteLoading(site.domain)}
                      className={`h-9 w-9 rounded-lg transition-all ${
                        isSiteLoading(site.domain)
                          ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200'
                      }`}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Настройки"
                      onClick={() =>
                          window.location.href = `/settings/${site.domain}/pages`
                        }
                      className="h-9 w-9 rounded-lg transition-all bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 border border-gray-200"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Удалить"
                      onClick={() => handleDeleteSite(site.domain)}
                      disabled={isSiteLoading(site.domain)}
                      className={`h-9 w-9 rounded-lg transition-all ${
                        isSiteLoading(site.domain)
                          ? 'bg-red-200 text-red-400 cursor-not-allowed'
                          : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}
