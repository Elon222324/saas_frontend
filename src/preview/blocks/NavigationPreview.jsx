// src/preview/blocks/NavigationPreview.jsx

import { useEffect, useRef } from 'react'
import { Navigation } from './Navigation'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { applyCssVariablesFromUiSchema } from '@/utils/applyCssVariables'
import { PreviewWrapper } from '@/preview/PreviewWrapper'

export default function NavigationPreview({ settings }) {
  const { data } = useSiteSettings()
  const applied = useRef(false)

  useEffect(() => {
    if (data?.ui_schema && !applied.current) {
      console.log('[NavigationPreview] applying ui_schema styles')
      applyCssVariablesFromUiSchema(data.ui_schema)
      applied.current = true
    }
  }, [data?.ui_schema])

  const nav = settings.items?.filter(item => item.visible)

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
        <Navigation settings={settings} navigation={nav} />
      </PreviewWrapper>
    </div>
  )
}
