import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteTokenString } from '../hooks/useSiteToken'

const SiteSettingsContext = createContext()

export const SiteSettingsProvider = ({ children }) => {
  const { domain } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const site_name = domain ? `${domain}${containerSuffix}` : null

  const { 
    token: siteToken, 
    isLoading: isTokenLoading, 
    refetch: refetchSiteToken 
  } = useSiteTokenString(site_name, {
    enabled: !!site_name, // Запрашивать токен только если есть имя сайта
  })

  // 💡 refetch: функция повторной загрузки данных
  const fetchData = useCallback(() => {
    if (!siteToken) {
      console.log('⏳ [SITE SETTINGS] Ожидание токена сайта...')
      return
    }

    setLoading(true)
    
    const url = `${API_URL}/schema/site-settings?site_name=${site_name}`
    console.log('📤 [SITE SETTINGS] Отправляем запрос на:', url)
    console.log('🔑 [SITE SETTINGS] Authorization: Bearer', siteToken.substring(0, 20) + '...')
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${siteToken}`,
        'Accept': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => {
        console.log('📥 [SITE SETTINGS] Статус ответа:', res.status)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((result) => {
        console.log('✅ [SITE SETTINGS] Результат получен:', result)
        setData(result)
      })
      .catch(error => {
        console.error('❌ [SITE SETTINGS] Ошибка при загрузке:', error)
      })
      .finally(() => setLoading(false))
  }, [API_URL, site_name, siteToken])

  // Загружаем данные при монтировании и при изменении токена
  useEffect(() => {
    if (site_name && siteToken) {
      console.log('🚀 [SITE SETTINGS] Инициализация настроек сайта для:', site_name)
      console.log('🔗 [SITE SETTINGS] URL:', `${API_URL}/schema/site-settings?site_name=${site_name}`)
      fetchData()
    }
  }, [fetchData, site_name, siteToken, API_URL])

  return (
    <SiteSettingsContext.Provider value={{ 
      data, 
      setData, 
      loading: loading || isTokenLoading, 
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
