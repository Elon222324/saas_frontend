// src/preview/blocks/NavigationPreview.jsx

import { useEffect, useRef, useState } from 'react'
import { Navigation } from './Navigation'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { applyCssVariablesFromUiSchema } from '@/utils/applyCssVariables'
import { PreviewWrapper } from '@/preview/PreviewWrapper'

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
    return (
      <div className="p-4 text-sm text-gray-500">
        Нет видимых пунктов меню с block_id: {settings.block_id}
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded border shadow">
      <PreviewWrapper>
        <div style={styleVars}>
          <Navigation settings={blockSettings} navigation={nav} />
        </div>
      </PreviewWrapper>
    </div>
  )
}
