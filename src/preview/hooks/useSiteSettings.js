import { useEffect, useState, useCallback } from 'react'
import { getSiteInfo } from '../api/getSiteInfo'

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const applyCssVariables = (data) => {
    const needsPx = ['font_size_base', 'max_width', 'container_padding', 'border_radius']

    for (const [key, value] of Object.entries(data)) {
      const cssKey = `--${key.replace(/_/g, '-')}`
      const cssValue = needsPx.includes(key) ? `${value}px` : value
      document.documentElement.style.setProperty(cssKey, cssValue)
    }

    const oldStyle = document.querySelector('style[data-from="custom_css"]')
    if (oldStyle) oldStyle.remove()

    if (data.custom_css) {
      const styleTag = document.createElement('style')
      styleTag.setAttribute('data-from', 'custom_css')
      styleTag.innerHTML = data.custom_css
      document.head.appendChild(styleTag)
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const raw = await getSiteInfo()

      // применяем стили, если есть common
      if (raw.common) applyCssVariables(raw.common)

      // сохраняем ВСЁ, включая navigation / pages / blocks
      setSettings(raw)

    } catch (err) {
      console.error('Ошибка загрузки настроек сайта:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data: settings, loading, refetch: fetchData }
}
