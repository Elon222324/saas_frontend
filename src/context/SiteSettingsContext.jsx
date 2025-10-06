import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteToken } from '../hooks/useSiteToken'

const SiteSettingsContext = createContext()

export const SiteSettingsProvider = ({ children }) => {
  const { domain } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const site_name = `${domain}${containerSuffix}`
  const site_name_for_token = domain // Без суффикса для токена

  // 🔑 Используем новый централизованный хук для получения токена
  const { 
    data: token, 
    isLoading: tokenLoading, 
    error: tokenError,
    refetch: refetchSiteToken 
  } = useSiteToken(site_name_for_token)

  // Формируем объект токена в старом формате для обратной совместимости
  const siteToken = token ? { token, raw: token } : null

  // 💡 refetch: функция повторной загрузки данных
  const fetchData = useCallback(() => {
    setLoading(true)
    fetch(`${API_URL}/schema/site-settings?site_name=${site_name}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        console.log('[API result]:', result)
        setData(result)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [API_URL, site_name])

  // Загружаем данные когда токен готов
  useEffect(() => {
    if (token && !tokenLoading) {
      console.log('🚀 [SITE SETTINGS] Инициализация настроек сайта для:', site_name)
      console.log('🔗 [SITE SETTINGS] URL для нового API:', `https://${site_name_for_token}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/`)
      fetchData()
    }
  }, [token, tokenLoading, fetchData, site_name, site_name_for_token])

  // Логируем ошибки токена
  useEffect(() => {
    if (tokenError) {
      console.error('❌ [SITE SETTINGS] Ошибка получения токена:', tokenError)
    }
  }, [tokenError])

  return (
    <SiteSettingsContext.Provider value={{ 
      data, 
      setData, 
      loading: loading || tokenLoading, 
      site_name, 
      siteToken,
      refetch: fetchData,
      refetchSiteToken 
    }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
