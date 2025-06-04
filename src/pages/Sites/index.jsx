import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import {
  Pause,
  Play,
  RefreshCcw,
  Trash2,
  ExternalLink,
  Plus,
  Copy,
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
      const res = await api.get('/api/sites/get_all/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      setSites(res.data)
    } catch (err) {
      console.error('Ошибка при получении сайтов:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSite = async () => {
    if (!newDomain.trim()) return

    try {
      setAdding(true)
      await api.post(
        '/api/sites/add_new',
        { domain: newDomain.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      setNewDomain('')
      await fetchSites()
    } catch (err) {
      console.error('Ошибка при добавлении сайта:', err)
    } finally {
      setAdding(false)
    }
  }

  const handleStopSite = async (domain) => {
    if (isSiteLoading(domain)) return
    setSiteLoading(domain, true)
    try {
      await api.post('/api/sites/stop-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      await fetchSites()
    } catch (err) {
      console.error('Ошибка при остановке сайта:', err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleStartSite = async (domain) => {
    if (isSiteLoading(domain)) return
    setSiteLoading(domain, true)
    try {
      await api.post('/api/sites/start-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      await fetchSites()
    } catch (err) {
      console.error('Ошибка при запуске сайта:', err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleRestartSite = async (domain) => {
    if (isSiteLoading(domain)) return
    setSiteLoading(domain, true)
    try {
      await api.post('/api/sites/restart-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      await fetchSites()
    } catch (err) {
      console.error('Ошибка при перезапуске сайта:', err)
    } finally {
      setSiteLoading(domain, false)
    }
  }

  const handleDeleteSite = async (domain) => {
    if (isSiteLoading(domain)) return
    setSiteLoading(domain, true)
    try {
      await api.post('/api/sites/delete-site', { domain }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      await fetchSites()
    } catch (err) {
      console.error('Ошибка при удалении сайта:', err)
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

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Сайты</h1>

      {/* Добавление сайта */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Введите домен (без .site)"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          className="border rounded px-4 py-2 w-full max-w-sm"
        />
        <Button
          onClick={handleAddSite}
          disabled={adding}
          className="flex gap-2 items-center"
        >
          <Plus size={18} />
          {adding ? 'Добавление...' : 'Добавить'}
        </Button>
      </div>

      {/* Список сайтов */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white p-4 rounded shadow border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{site.name}</h2>
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
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <ExternalLink size={18} />
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyLink(site.domain)}
                    title="Скопировать ссылку"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <Copy size={18} />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600">Домен: {site.domain}</p>
              <p className="text-sm text-gray-600">Порт: {site.port}</p>
              <p className="text-sm text-gray-600">Путь: {site.path}</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  site.status === 'running' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                Статус: {site.status}
              </p>
            </div>

            <div className="flex justify-start gap-2 mt-4 flex-wrap">
              {site.status === 'running' ? (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Остановить"
                  onClick={() => handleStopSite(site.domain)}
                  disabled={isSiteLoading(site.domain)}
                  className={`${
                    isSiteLoading(site.domain)
                      ? 'bg-orange-200 text-orange-300 cursor-not-allowed'
                      : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
                  }`}
                >
                  <Pause size={18} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Запустить"
                  onClick={() => handleStartSite(site.domain)}
                  disabled={isSiteLoading(site.domain)}
                  className={`${
                    isSiteLoading(site.domain)
                      ? 'bg-green-200 text-green-300 cursor-not-allowed'
                      : 'bg-green-100 hover:bg-green-200 text-green-600'
                  }`}
                >
                  <Play size={18} />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                title="Перезапустить"
                onClick={() => handleRestartSite(site.domain)}
                disabled={isSiteLoading(site.domain)}
                className={`${
                  isSiteLoading(site.domain)
                    ? 'bg-blue-200 text-blue-300 cursor-not-allowed'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                }`}
              >
                <RefreshCcw size={18} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Удалить"
                onClick={() => handleDeleteSite(site.domain)}
                disabled={isSiteLoading(site.domain)}
                className={`${
                  isSiteLoading(site.domain)
                    ? 'bg-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Trash2 size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Настройки"
                onClick={() =>
                    window.location.href = `/settings/${site.domain}/pages`
                  }
                className="bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <Settings size={18} />
              </Button>                
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
