import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { PreviewWrapper } from '@preview/PreviewWrapper'
import { PopularItems } from './PopularItems'
import { applyCssVariablesFromUiSchema } from '@preview/utils/applyCssVariables'

export default function PopularItemsPreview({ settings = {}, data = {}, commonSettings = {} }) {
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

  return (
    <PreviewWrapper>
      <div style={styleVars}>
        <div className="max-w-full mx-auto text-[13px] leading-tight">
          <PopularItems settings={settings} data={data} commonSettings={commonSettings} />
        </div>
      </div>
    </PreviewWrapper>
  )
}
