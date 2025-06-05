// src/preview/blocks/NavigationPreview.jsx

import { useEffect, useRef, useState, useMemo } from 'react'
import { Navigation } from './Navigation' // Убедитесь, что это правильный путь к вашему компоненту навигации
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { applyCssVariablesFromUiSchema } from '@preview/utils/applyCssVariables'
import { PreviewWrapper } from '@preview/PreviewWrapper'

export default function NavigationPreview({ settings }) {
  const { data } = useSiteSettings()
  const applied = useRef(false)
  const [styleVars, setStyleVars] = useState({})
  const nav = (() => {
    if (settings?.items?.length > 0) {
      return [...settings.items]
        .filter(item => item.visible)
        .sort((a, b) => a.order - b.order)
    }

    return data?.navigation
      ?.filter(item => item.block_id === settings.block_id && item.visible)
      ?.sort((a, b) => a.order - b.order)
  })()

  const highlightKey = useMemo(
    () => JSON.stringify({ settings, nav }),
    [settings, nav]
  )

  const blockSettings = {
    ...data?.blocks?.[settings?.slug]?.find(b => b.real_id === settings?.block_id)?.settings,
    ...settings,
    link_hover_color: settings?.hover_color,
  }

  useEffect(() => {
    if (!data?.ui_schema) return

    const useCustom = settings?.custom_appearance === true
    const css = {}

    if (useCustom) {
      Object.keys(blockSettings).forEach((key) => {
        if (key.includes('color') || key.startsWith('bg_')) {
          css[`--${key.replace(/_/g, '-')}`] = blockSettings[key]
        }
        if (key === 'hover_color') {
          css['--link-hover-color'] = blockSettings[key]
        }
      })

      console.log('[🧩 custom theme] styleVars:', css)
      setStyleVars(css)
    } else {
      console.log('[🌐 global theme] fallback to ui_schema')
      applyCssVariablesFromUiSchema(data.ui_schema)
      setStyleVars({})
    }

    console.log('[📦 blockSettings]:', blockSettings)
    console.log('[⚙️ settings]:', settings)
  }, [data?.ui_schema, settings?.custom_appearance, settings])

  if (!nav?.length) {
    // Этот div можно оставить с p-4, так как он служит сообщением об отсутствии контента
    // и его стилизация для выделения вполне уместна.
    return (
      <div className="p-4 text-sm text-gray-500">
        Нет видимых пунктов меню с block_id: {settings.block_id}
      </div>
    )
  }

  return (
    // ИЗМЕНЕН ЭТОТ DIV:
    // Удалены классы: bg-white, p-4, rounded, border, shadow.
    // Теперь это просто контейнер без лишних стилей.
    <div> {/* Раньше: <div className="bg-white p-4 rounded border shadow"> */}
      <PreviewWrapper highlightKey={highlightKey}>
        <div style={styleVars}>
          {/* Здесь нет внутреннего div с p-2 sm:p-3, как у HeaderPreview,
              так что больше ничего менять не нужно. */}
          <Navigation settings={blockSettings} navigation={nav} />
        </div>
      </PreviewWrapper>
    </div>
  )
}