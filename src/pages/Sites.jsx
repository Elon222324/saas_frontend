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
} from 'lucide-react'

export default function Sites() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

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
    try {
      await api.post(
        '/api/sites/stop-site',
        { domain },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      await fetchSites()
    } catch (err) {
      console.error('Ошибка при остановке сайта:', err)
    }
  }

  const handleStartSite = async (domain) => {
    try {
        await api.post(
          'api/sites/start-site',
          { domain },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )
        await fetchSites()
      } catch (err) {
        console.error('Ошибка при запуске сайта:', err)
      }
    }

  const handleRestartSite = async (domain) => {
    console.log('TODO: перезапуск', domain)
  }

  const handleDeleteSite = async (domain) => {
    try {
        await api.post(
          '/api/sites/delete-site',
          { domain },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )
        await fetchSites()
      } catch (err) {
        console.error('Ошибка при удаление сайта:', err)
      }
    }

  useEffect(() => {
    fetchSites()
  }, [])

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold"> Сайты</h1>

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
          Добавить
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
              <h2 className="text-lg font-semibold">{site.name}</h2>
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

              {site.status === 'running' ? (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Остановить"
                  onClick={() => handleStopSite(site.domain)}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-600"
                >
                  <Pause size={18} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Запустить"
                  onClick={() => handleStartSite(site.domain)}
                  className="bg-green-100 hover:bg-green-200 text-green-600"
                >
                  <Play size={18} />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                title="Перезапустить"
                onClick={() => handleRestartSite(site.domain)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-600"
              >
                <RefreshCcw size={18} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Удалить"
                onClick={() => handleDeleteSite(site.domain)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
