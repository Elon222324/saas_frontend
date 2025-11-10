import { useEffect, useState } from 'react'
import { PreviewWrapper } from '@preview/PreviewWrapper'
import { applyCssVariablesFromUiSchema } from '@preview/utils/applyCssVariables'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function PromoStoriesPreview({ settings = {}, data = {}, commonSettings = {} }) {
  const { data: globalSiteData } = useSiteSettings()
  const [styleVars, setStyleVars] = useState({})

  useEffect(() => {
    if (!globalSiteData?.ui_schema) return

    applyCssVariablesFromUiSchema(globalSiteData.ui_schema)
    const vars = {}
    Object.entries(settings).forEach(([key, val]) => {
      if (key.includes('color') || key.startsWith('bg_')) {
        vars[`--${key.replace(/_/g, '-')}`] = val
      }
    })
    setStyleVars(vars)
  }, [settings, globalSiteData?.ui_schema])

  // TODO: Здесь добавить компонент PromoStories для отображения
  // Пример: import PromoStories from './PromoStories'
  return (
    <PreviewWrapper>
      <div style={styleVars}>
        <div className="max-w-full mx-auto">
          <div className="p-4 bg-gray-100 rounded text-center text-gray-600">
            🎬 PromoStories Preview (требуется реализация компонента визуализации)
          </div>
        </div>
      </div>
    </PreviewWrapper>
  )
}

