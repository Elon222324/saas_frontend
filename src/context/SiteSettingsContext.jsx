import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

const SiteSettingsContext = createContext()

export const SiteSettingsProvider = ({ children }) => {
  const { domain } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [siteToken, setSiteToken] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const site_name = `${domain}${containerSuffix}`
  const site_name_for_token = domain // Без суффикса для токена

  // 🔑 Функция для получения токена сайта
  const fetchSiteToken = useCallback(async () => {
    try {
      console.log('🔑 [SITE TOKEN] Начинаем получение токена для сайта:', site_name_for_token)
      
      const response = await fetch(`${API_URL}/user/site-token/${site_name_for_token}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const tokenData = await response.json()
      console.log('✅ [SITE TOKEN] Токен успешно получен:', tokenData)
      setSiteToken(tokenData)
      return tokenData
    } catch (error) {
      console.error('❌ [SITE TOKEN] Ошибка при получении токена сайта:', error)
      console.log('⚠️ [SITE TOKEN] Продолжаем работу без токена сайта (старая логика)')
      return null
    }
  }, [API_URL, site_name_for_token])

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
        console.log('[API result]:', result)  // 👈 вот сюда
        setData(result)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
        }, [API_URL, site_name])

  // Первый запрос
  useEffect(() => {
    console.log('🚀 [SITE SETTINGS] Инициализация настроек сайта для:', site_name)
    
    // Сначала пытаемся получить токен сайта
    fetchSiteToken().then(() => {
      // Затем загружаем основные данные
      fetchData()
    })
  }, [fetchData, fetchSiteToken])

  return (
    <SiteSettingsContext.Provider value={{ 
      data, 
      setData, 
      loading, 
      site_name, 
      siteToken,
      refetch: fetchData,
      refetchSiteToken: fetchSiteToken 
    }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
