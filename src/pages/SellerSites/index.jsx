import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import api from '@/lib/axios'
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react'

export default function SellerSites() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  }

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true)
      try {
        const res = await api.get('/sites/get_all/', { headers: authHeaders })
        setSites(res.data || [])
      } catch (e) {
        console.error('❌ Ошибка загрузки сайтов:', e)
        setError('Не удалось загрузить список сайтов')
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  const stripAppSuffix = (value) => {
    if (!value) return value
    const suffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
    return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value
  }

  const handleSelectSite = (site) => {
    const siteName = stripAppSuffix(site.domain)
    navigate(`/board/${siteName}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <Loader size={48} className="text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Загрузка сайтов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Мои сайты</h1>
            <p className="text-gray-600">Выберите сайт для открытия борда</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200 transition"
          >
            <ArrowLeft size={18} />
            Назад
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg">У вас нет сайтов</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => {
              const siteName = stripAppSuffix(site.domain)
              return (
                <button
                  key={site.id}
                  onClick={() => handleSelectSite(site)}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all transform hover:scale-105 text-left group border-l-4 border-blue-500"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                    {siteName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{site.domain}</p>
                  <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Открыть борд →
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

