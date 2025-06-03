import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { PreviewWrapper } from '@/preview/PreviewWrapper'
import { Header } from './Header' // Это ваш фактический компонент шапки
import { applyCssVariablesFromUiSchema } from '@/utils/applyCssVariables'

export default function HeaderPreview({ settings }) {
  const { data } = useSiteSettings()
  const [styleVars, setStyleVars] = useState({})

  const blockId = settings?.block_id
  const slug = settings?.slug

  const block = data?.blocks?.[slug]?.find(b => b.real_id === blockId)
  const settingsFinal = { ...block?.settings, ...settings }
  const dataFinal = { ...block?.data }

  const navigation = data?.navigation?.filter(item => item.visible && item.block_id === blockId) || []

  useEffect(() => {
    if (!data?.ui_schema) return

    if (settingsFinal?.custom_appearance) {
      const vars = {}
      Object.entries(settingsFinal).forEach(([key, val]) => {
        if (key.includes('color') || key.startsWith('bg_')) {
          vars[`--${key.replace(/_/g, '-')}`] = val
        }
      })
      setStyleVars(vars)
    } else {
      applyCssVariablesFromUiSchema(data.ui_schema)
      setStyleVars({})
    }
  }, [settingsFinal, data?.ui_schema])

  return (
    // 1. Изменен самый внешний div:
    //    Удалены классы: bg-white, p-4, rounded, border, shadow.
    //    Теперь он просто будет контейнером без стилей.
    <div> {/* Раньше: <div className="bg-white p-4 rounded border shadow"> */}
      <PreviewWrapper>
        <div style={styleVars}>
          {/* Этот div с max-w-full mx-auto text-[13px] leading-tight можно оставить,
              так как он, вероятно, контролирует ширину содержимого и типографику. */}
          <div className="max-w-full mx-auto text-[13px] leading-tight">
            {/* 2. Изменен div, который непосредственно оборачивает компонент Header:
                Удалены классы: p-2, sm:p-3.
                Теперь он будет просто контейнером без внутренних отступов. */}
            <div> {/* Раньше: <div className="p-2 sm:p-3"> */}
              <Header
                settings={{
                  ...settingsFinal,
                  // padding_x: 8, // Эти padding_x и padding_y управляют внутренними отступами самой шапки,
                  // padding_y: 6, // их можно оставить, если шапка должна иметь свои внутренние отступы.
                }}
                data={dataFinal}
                commonSettings={data?.common || {}}
                navigation={navigation}
              />
            </div>
          </div>
        </div>
      </PreviewWrapper>
    </div>
  )
}