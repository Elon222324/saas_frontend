import { useEffect, useState, useMemo } from 'react'
import { PreviewWrapper } from '@preview/PreviewWrapper'
import QuickInfo from './QuickInfo'
import { applyCssVariablesFromUiSchema } from '@preview/utils/applyCssVariables'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function QuickInfoPreview({ settings = {}, data = {}, commonSettings = {} }) {
  const { data: globalSiteData } = useSiteSettings()
  const [styleVars, setStyleVars] = useState({})
  const highlightKey = useMemo(
    () => JSON.stringify({ settings, data, commonSettings }),
    [settings, data, commonSettings]
  )

  useEffect(() => {
    if (!globalSiteData?.ui_schema) return

    if (settings?.custom_appearance) {
      const vars = {}
      Object.entries(settings).forEach(([key, val]) => {
        if (key.includes('color') || key.startsWith('bg_')) {
          vars[`--${key.replace(/_/g, '-')}`] = val
        }
      })

      const varsJson = JSON.stringify(vars)
      const styleVarsJson = JSON.stringify(styleVars)

      if (varsJson !== styleVarsJson) {
        setStyleVars(vars)
      }
    } else {
      applyCssVariablesFromUiSchema(globalSiteData.ui_schema)
      if (Object.keys(styleVars).length > 0) {
        setStyleVars({})
      }
    }
  }, [settings, globalSiteData?.ui_schema])

  return (
    <PreviewWrapper highlightKey={highlightKey}>
      <div style={styleVars}>
        <QuickInfo settings={settings} data={data} commonSettings={commonSettings} />
      </div>
    </PreviewWrapper>
  )
}
