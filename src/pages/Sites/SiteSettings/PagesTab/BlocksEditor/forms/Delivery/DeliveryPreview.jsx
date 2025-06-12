import { useEffect, useState } from 'react'
import { PreviewWrapper } from '@preview/PreviewWrapper'
import { applyCssVariablesFromUiSchema } from '@preview/utils/applyCssVariables'
import Delivery from './Delivery'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function DeliveryPreview({ settings = {}, data = {}, commonSettings = {} }) {
  const { data: globalSiteData } = useSiteSettings()
  const [styleVars, setStyleVars] = useState({})

  useEffect(() => {
    if (!globalSiteData?.ui_schema) return

    if (settings?.custom_appearance) {
      const vars = {}
      Object.entries(settings).forEach(([key, val]) => {
        if (
          key.includes('color') ||
          key.includes('shadow') ||
          key.includes('font') ||
          key.includes('spacing') ||
          key.includes('radius')
        ) {
          vars[`--${key.replace(/_/g, '-')}`] = val
        }
      })

      const varsJson = JSON.stringify(vars)
      const styleVarsJson = JSON.stringify(styleVars)
      if (varsJson !== styleVarsJson) setStyleVars(vars)
    } else {
      applyCssVariablesFromUiSchema(globalSiteData.ui_schema)
      if (Object.keys(styleVars).length > 0) setStyleVars({})
    }
  }, [settings, globalSiteData?.ui_schema])

  return (
    <PreviewWrapper>
      <div style={styleVars}>
        <Delivery settings={settings} data={data} commonSettings={commonSettings} />
      </div>
    </PreviewWrapper>
  )
}