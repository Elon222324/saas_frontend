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
    fetch(`${API_URL}/schema/site-settings?site_name=${site_name}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [API_URL, site_name])

  // Первый запрос
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <SiteSettingsContext.Provider value={{ data, loading, site_name, refetch: fetchData }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
