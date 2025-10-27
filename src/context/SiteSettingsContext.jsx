import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

const SiteSettingsContext = createContext()

export const SiteSettingsProvider = ({ children }) => {
  const { domain } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const site_name = `${domain}${containerSuffix}`

  // 💡 refetch: функция повторной загрузки данных
  const fetchData = useCallback(() => {
    setLoading(true)
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      console.error('❌ [SITE SETTINGS] Токен не найден в localStorage!')
      setLoading(false)
      return
    }
    
    const url = `${API_URL}/schema/site-settings?site_name=${site_name}`
    console.log('📤 [SITE SETTINGS] Отправляем запрос на:', url)
    console.log('🔑 [SITE SETTINGS] Authorization: Bearer', token.substring(0, 20) + '...')
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
  }, [API_URL, site_name])

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    console.log('🚀 [SITE SETTINGS] Инициализация настроек сайта для:', site_name)
    console.log('🔗 [SITE SETTINGS] URL:', `${API_URL}/schema/site-settings?site_name=${site_name}`)
    fetchData()
  }, [fetchData, site_name, API_URL])

  return (
    <SiteSettingsContext.Provider value={{ 
      data, 
      setData, 
      loading, 
      site_name, 
      siteToken: null,
      refetch: fetchData,
      refetchSiteToken: null 
    }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
